document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("particles");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    let particlesArray = [];
    const numberOfParticles = 80;

    const whitePieces = ["♔","♕","♖","♗","♘","♙"];

    class Particle {
        constructor() {
            this.reset();
            this.isChessPiece = false;
            this.pieceSymbol = "";
            this.pieceOpacity = 0;
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedY = Math.random() * 0.7 + 0.2;
            this.opacity = Math.random() * 0.5 + 0.3;
        }

        convertToChessPiece() {
            this.isChessPiece = true;
            this.pieceSymbol = whitePieces[Math.floor(Math.random() * whitePieces.length)];
            this.pieceOpacity = 0.85;
        }

        update() {
            this.y -= this.speedY;

            if (this.y < 0) {
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }

            if (this.isChessPiece) {
                this.pieceOpacity -= 0.004;

                if (this.pieceOpacity <= 0) {
                    this.isChessPiece = false;
                    this.pieceOpacity = 0;
                }
            }
        }

        draw() {

            if (this.isChessPiece) {

                ctx.save();

                ctx.globalAlpha = this.pieceOpacity;
                ctx.font = "26px serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillStyle = "#ffffff";
                ctx.fillText(this.pieceSymbol, this.x, this.y);

                ctx.lineWidth = 1.5;
                ctx.strokeStyle = "rgba(255,255,255,0.9)";
                ctx.strokeText(this.pieceSymbol, this.x, this.y);

                ctx.restore();

            } else {

                ctx.fillStyle = `rgba(255,255,255,${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();

            }

        }
    }

    function initParticles() {
        particlesArray = [];
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particlesArray.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateParticles);
    }

    setInterval(() => {
        const randomIndex = Math.floor(Math.random() * particlesArray.length);
        particlesArray[randomIndex].convertToChessPiece();
    }, 7000);

    initParticles();
    animateParticles();

});