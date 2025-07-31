const HF_TOKEN = "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";
const MODEL_ENDPOINT = "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification";

let uploadedImage = null;

document.getElementById('imageInput').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
        uploadedImage = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.getElementById('previewImage');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('analyzeBtn').disabled = false;
        };
        reader.readAsDataURL(file);
    }
});

async function analyzeImage() {
    if (!uploadedImage) return;

    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.textContent = 'Analyzing...';
    analyzeBtn.disabled = true;

    try {
        const response = await fetch(MODEL_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${HF_TOKEN}`,
                Accept: 'application/json',
            },
            body: uploadedImage,
        });

        const result = await response.json();
        if (result.error) throw new Error(result.error);

        const topResult = result[0];
        document.getElementById('diseaseName').textContent = topResult.label;
        document.getElementById('confidenceScore').textContent = (topResult.score * 100).toFixed(2) + '%';
        //document.getElementById('resultBox').style.display = 'block';
    } catch (err) {
        alert('Error: ' + err.message);
    } finally {
        analyzeBtn.textContent = 'Analyze with AI';
        analyzeBtn.disabled = false;
    }
}