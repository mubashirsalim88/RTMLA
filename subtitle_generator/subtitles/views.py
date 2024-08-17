from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return render(request, 'subtitles/index.html')

def upload_video(request):
    if request.method == 'POST':
        video = request.FILES['video']
        languages = request.POST.getlist('languages')
        # For now, just print the video filename and selected languages
        print(f"Video uploaded: {video.name}")
        print(f"Selected languages: {languages}")
        return HttpResponse("Video uploaded and languages selected!")
    return HttpResponse("Upload failed!")
