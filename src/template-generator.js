/**
 * @param {Number} width width of the image in pixels
 * @param {Number} height height of the image in pixels
 * @param {String} style one of "dot", "line", or "graph"
 * @param {Number} distance space between vertices in pixels
 * @param {Number} size width of lines or size of dots in pixels
 * @param {String} color color of dots / lines
 * @param {String} backgroundColor color of the background
 * @param {Number} margins margins around the page before dots / lines begin
 *
 * @returns {HTMLCanvasElement}
 */
function createImage(width, height, style, distance, size, color, backgroundColor, margins) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const centerX = width / 2;
    const centerY = height / 2;

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    // Fill dots/lines
    if (style == "dot") {
        ctx.fillStyle = color;
        for (let j = 0; j <= height / 2 + distance; j += distance) {
            for (let i = 0; i <= width / 2 + distance; i += distance) {
                const bottomRightX = centerX + i;
                const bottomRightY = centerY + j;
                if (bottomRightX >= margins && bottomRightY >= margins && bottomRightX <= width - margins && bottomRightY <= height - margins) {
                    ctx.beginPath();
                    ctx.arc(bottomRightX, bottomRightY, size, 0, Math.PI * 2, true);
                    ctx.fill();
                }

                if (i != 0) {
                    const bottomLeftX = centerX - i;
                    const bottomLeftY = centerY + j;
                    if (bottomLeftX >= margins && bottomLeftY >= margins && bottomLeftX <= width - margins && bottomLeftY <= height - margins) {
                        ctx.beginPath();
                        ctx.arc(bottomLeftX, bottomLeftY, size, 0, Math.PI * 2, true);
                        ctx.fill();
                    }
                }

                if (j != 0) {
                    const topRightX = centerX + i;
                    const topRightY = centerY - j;
                    if (topRightX >= margins && topRightY >= margins && topRightX <= width - margins && topRightY <= height - margins) {
                        ctx.beginPath();
                        ctx.arc(topRightX, topRightY, size, 0, Math.PI * 2, true);
                        ctx.fill();
                    }

                    if (i != 0) {
                        const topLeftX = centerX - i;
                        const topLeftY = centerY - j;
                        if (topLeftX >= margins && topLeftY >= margins && topLeftX <= width - margins && topLeftY <= height - margins) {
                            ctx.beginPath();
                            ctx.arc(topLeftX, topLeftY, size, 0, Math.PI * 2, true);
                            ctx.fill();
                        }
                    }
                }
            }
        }
    }
    else if (style == "line") {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        for (let j = 0; j <= height / 2 + distance; j += distance) {
            const bottomY = centerY + j;
            if (bottomY >= margins && bottomY <= height - margins) {
                ctx.moveTo(margins, bottomY);
                ctx.lineTo(width - margins, bottomY);
            }
            if (j != 0) {
                const topY = centerY - j;
                if (topY >= margins && topY <= height - margins) {
                    ctx.moveTo(margins, topY);
                    ctx.lineTo(width - margins, topY);
                }
            }
        }
        ctx.stroke();
    }
    else if (style == "graph") {
        ctx.strokeStyle = color;
        ctx.lineWidth = size;
        for (let j = 0; j <= height / 2 + distance; j += distance) {
            const bottomY = centerY + j;
            if (bottomY >= margins && bottomY <= height - margins) {
                ctx.moveTo(margins, bottomY);
                ctx.lineTo(width - margins, bottomY);
            }
            if (j != 0) {
                const topY = centerY - j;
                if (topY >= margins && topY <= height - margins) {
                    ctx.moveTo(margins, topY);
                    ctx.lineTo(width - margins, topY);
                }
            }
        }

        for (let i = 0; i <= width / 2 + distance; i += distance) {
            const rightX = centerX + i;
            if (rightX >= margins && rightX <= width - margins) {
                ctx.moveTo(rightX, margins);
                ctx.lineTo(rightX, height - margins);
            }
            if (i != 0) {
                const leftX = centerX - i;
                if (leftX >= margins && leftX <= width - margins) {
                    ctx.moveTo(leftX, margins);
                    ctx.lineTo(leftX, height - margins);
                }
            }
        }
        ctx.stroke();
    }

    return canvas;
}


/**
 * @param {HTMLElement} element an input or select to find the label for
 * @returns {HTMLElement} the given element's label
 */
function findLabel(element) {
    return element.parentElement.querySelector(".label");
}


window.addEventListener("load", async () => {
    /** @type {HTMLSelectElement} */
    const unitSelect = document.querySelector("#unit");

    /** @type {HTMLInputElement} */
    const ppuInput = document.querySelector("#pixels-per-unit");

    /** @type {HTMLInputElement} */
    const widthInput = document.querySelector("#width");

    /** @type {HTMLInputElement} */
    const heightInput = document.querySelector("#height");

    /** @type {HTMLSelectElement} */
    const styleSelect = document.querySelector("#style");

    /** @type {HTMLInputElement} */
    const distanceInput = document.querySelector("#distance");

    /** @type {HTMLInputElement} */
    const sizeInput = document.querySelector("#size");

    /** @type {HTMLInputElement} */
    const colorInput = document.querySelector("#color");

    /** @type {HTMLInputElement} */
    const backgroundColorInput = document.querySelector("#background-color");

    /** @type {HTMLInputElement} */
    const marginInput = document.querySelector("#margins");

    /** @type {HTMLButtonElement} */
    const previewButton = document.querySelector("#preview");

    /** @type {HTMLButtonElement} */
    const downloadButton = document.querySelector("#download");

    function vertexStyle() {
        if (styleSelect.value == "dot") {
            return "Dot";
        }
        else {
            return "Line";
        }
    }

    function onSelectChange() {
        if (unitSelect.value == "px") {
            ppuInput.parentElement.classList.add("hidden");
            findLabel(distanceInput).textContent = `Pixels Between ${vertexStyle()}s`;
            ppuInput.value = "1";
        }
        else if (unitSelect.value == "in") {
            findLabel(ppuInput).textContent = "Pixels per Inch";
            findLabel(distanceInput).textContent = `Inches Between ${vertexStyle()}s`;
            ppuInput.value = "100";
            ppuInput.parentElement.classList.remove("hidden");
        }
        else if (unitSelect.value == "mm") {
            findLabel(ppuInput).textContent = "Pixels per Millimeter";
            findLabel(distanceInput).textContent = `Millimeters Between ${vertexStyle()}s`;
            ppuInput.value = "5";
            ppuInput.parentElement.classList.remove("hidden");
        }
        findLabel(sizeInput).textContent = `${vertexStyle()} Size In Pixels`;
        findLabel(colorInput).textContent = `${vertexStyle()} Color`;
    }

    onSelectChange();

    unitSelect.addEventListener("change", onSelectChange);
    styleSelect.addEventListener("change", onSelectChange);

    function createPreview() {
        for (const canvas of document.querySelectorAll("canvas")) {
            canvas.remove();
        }
        const canvas = createImage(
            widthInput.valueAsNumber * ppuInput.valueAsNumber,
            heightInput.valueAsNumber * ppuInput.valueAsNumber,
            styleSelect.value,
            distanceInput.valueAsNumber * ppuInput.valueAsNumber,
            sizeInput.valueAsNumber,
            colorInput.value,
            backgroundColorInput.value,
            marginInput.valueAsNumber * ppuInput.valueAsNumber,
        );
        document.body.appendChild(canvas);
        return canvas;
    }

    previewButton.addEventListener("click", () => {
        createPreview();
    });

    downloadButton.addEventListener("click", () => {
        const canvas = createPreview();
        const link = document.createElement("a");
        link.download = "template.png";
        link.href = canvas.toDataURL();
        link.click();
    });
});
