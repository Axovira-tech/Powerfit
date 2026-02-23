
# Manual cleanup for remaining images.
# Some URLs might have been missed or failed to download properly due to complexity.
# I will download them one by one.

$images = @{
    "images/image_31.jpg" = "https://images.unsplash.com/photo-1583454110551-21f2fa2adfcd?q=80&w=600&auto=format&fit=crop";
    "images/image_32.jpg" = "https://images.unsplash.com/photo-1517344884509-a0c97ec81cc6?q=80&w=600&auto=format&fit=crop";
    "images/image_33.jpg" = "https://images.unsplash.com/photo-1554284126-db63354813dd?q=80&w=600&auto=format&fit=crop";
    "images/image_34.jpg" = "https://images.unsplash.com/photo-1517963879466-e825c15f99a5?q=80&w=600&auto=format&fit=crop"
}

foreach ($key in $images.Keys) {
    if (!(Test-Path $key)) {
        Write-Host "Downloading $key..."
        try {
            Invoke-WebRequest -Uri $images[$key] -OutFile $key -UserAgent "Mozilla/5.0"
        } catch {
            Write-Host "Failed " + $_
        }
    }
}
