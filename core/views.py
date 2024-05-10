from django.shortcuts import render


def index(request):
    return render(request, 'core/index.html', {
        'user': request.user.is_staff
    })


def about(request):
    return render(request, 'core/about.html')