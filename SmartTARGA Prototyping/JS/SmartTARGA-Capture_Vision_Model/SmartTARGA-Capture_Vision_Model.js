var fs = require('fs');
var childProcess = require('child_process');

var imageName = (new Date).getTime() + ".jpeg"; // name our new picture with the time so names are unique
var decodedImage;

childProcess.exec('/home/root/bin/ffmpeg/ffmpeg -loglevel panic -y -s 320x240 -f video4linux2 -i /dev/video0 -vframes 1 ./capture.jpeg');
childProcess.exec('ffmpeg -f video4linux2 -i /dev/video0 -vframes 1' + imageName, function(error, stdout, stderr) {
	
	console.log('stdout: ' + stdout);
	console.log('stderr: ' + stderr);
	if (error !== null) {
	  console.log('exec error: ' + error);
	}

	fs.readFile(imageName, function(err, original_data){
		fs.writeFile('image_orig.jpg', original_data, function(err) {});
		var base64Image = original_data.toString('base64');
		decodedImage = new Buffer(base64Image, 'base64');
		fs.writeFile('image_decoded.jpg', decodedImage, function(err) {});
	});

var gcloud = require('gcloud')({
  projectId: 'YOUR_PROJECT_ID',
  keyFilename: 'YOUR_KEY_LOCATION'
});

var vision = gcloud.vision();

vision.detectLabels('./capture.jpeg', { verbose : true }, function(err, labels){
  if(err){
    console.log(err);
  }else{
    console.log(labels);
  }
});