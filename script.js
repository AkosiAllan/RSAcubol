// Function to toggle the visibility of the containers
function toggleContainers() {
    const frontContainer = document.querySelector('.outer-container:not(.back-content)');
    const backContainer = document.querySelector('.outer-container.back-content');

    // Toggle the visibility
    frontContainer.style.display = frontContainer.style.display === 'none' ? 'block' : 'none';
    backContainer.style.display = backContainer.style.display === 'none' ? 'block' : 'none';
}

const nameElement = document.getElementById('name');

let x = 0;
let y = 0;
let xSpeed = 2;
let ySpeed = 2;

const colors = [' #ff0000',
    '#ff7300',
    '#fffb00',
    '#48ff00',
    '#00ffd5',
    '#002bff',
    '#7a00ff',
    '#ff00c8'];
let currentColorIndex = 0;

function updatePosition() {
    x += xSpeed;
    y += ySpeed;

    const maxX = window.innerWidth - nameElement.clientWidth;
    const maxY = window.innerHeight - nameElement.clientHeight;

    if (x > maxX || x < 0) {
        changeName();
        xSpeed *= -1;
    }

    if (y > maxY || y < 0) {
        changeName();
        ySpeed *= -1;
    }

    nameElement.style.left = x + 'px';
    nameElement.style.top = y + 'px';

    requestAnimationFrame(updatePosition);
}

function changeName() {
    const names = ['Mathew Joshua Rosales', 'Allan Felices', 'Junnel Entoma ', 'Michael Saldo ', 'Cristian Redila', 'Jez Reel Lesigues', 'Carl Hope Cavite'];
    const currentName = nameElement.textContent;
    const nextName = names[(names.indexOf(currentName) + 1) % names.length];

    currentColorIndex = (currentColorIndex + 1) % colors.length;
    const nextColor = colors[currentColorIndex];


    nameElement.textContent = nextName;
    nameElement.style.color = nextColor;
}

updatePosition();


function displayHelp() {
    // You can customize the help information as needed
    const helpText = `
          RSA Calculator Help:
          - Enter prime numbers for p, q, and e.
          - Input plaintext in the Plaintext field.
          - Click CALCULATE to perform RSA calculations.
          - View results and steps.
          - Click RESET to clear inputs and results.
        `;
    alert(helpText);
}

function displayHelp1() {
    // You can customize the help information as needed
    const helpText = `
          Mod Calculator Help:
          - Enter dividend, exponent, and divisor
          - Click CALCULATE to perform Modulus calculations.
          - View results and steps.
          - Click RESET to clear inputs and results.
        `;
    alert(helpText);
}

function resetValues() {
    document.getElementById('pInput').value = '';
    document.getElementById('qInput').value = '';
    document.getElementById('eInput').value = '';
    document.getElementById('ptInput').value = '';
    document.getElementById('result').innerHTML = '';
    document.getElementById('imageContainer').innerHTML = '';

    // Reset the size of the plaintext input
    var input = document.getElementById('ptInput');
    input.size = 1;
}

function autoExpand(input) {
    // Get the length of the current input value
    var length = input.value.length;

    // Set the size attribute based on the length
    input.size = length + 1;
}

// Trigger the autoExpand function on page load (in case there is existing text)
document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('ptInput');
    autoExpand(input);
});
function isPrime(num) {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) {
            return false;
        }
    }
    return true;
}

function modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

function calculateValues() {
    const pValue = document.getElementById('pInput').valueAsNumber;
    const qValue = document.getElementById('qInput').valueAsNumber;
    const eValue = document.getElementById('eInput').valueAsNumber;
    const plaintext = document.getElementById('ptInput').value;

    if (isNaN(pValue) || isNaN(qValue) || isNaN(eValue) || !isPrime(pValue) || !isPrime(qValue) || !isPrime(eValue)) {
        alert('Please check your inputed numbers if it is a prime number');
        return;
    }

    const nResult = pValue * qValue;
    let originalTResult = (pValue - 1) * (qValue - 1);
    let tResult = originalTResult;

    // Function to convert plaintext to ASCII values
    function convertPlaintextToASCII(text) {
        let tableHTML = '<table border="1" style="background-color: white;">\n<tr>\n<th>Character</th>\n<th>ASCII Code</th>\n</tr>\n';

        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            tableHTML += `<tr>\n<td>${text[i]}</td>\n<td>${charCode}</td>\n</tr>\n`;
        }

        tableHTML += '</table>';
        return tableHTML;
    }

    const plaintextASCII = convertPlaintextToASCII(plaintext);


    // Calculate the value of d by doubling φ(n) until it's a whole number
    let dValue = (originalTResult * 1 + 1) / eValue;
    let rounds = 1;

    // Check if d is a decimal, and add φ(n) to itself until d is a whole number
    while (dValue % 1 !== 0) {
        originalTResult += tResult; // Add φ(n) to itself
        dValue = (originalTResult * 1 + 1) / eValue;
        rounds++;
    }


    // Encryption: C = M^E mod n
    let encryptedValues = [];
    let encryptionSteps = ''; // Modify to a string to store one step for each letter
    for (let i = 0; i < plaintext.length; i++) {
        const charCode = plaintext.charCodeAt(i);
        const encryptedValue = modPow(charCode, eValue, nResult);
        encryptedValues.push(encryptedValue);

        // Add one encryption step details to the string
        encryptionSteps += `${plaintext[i]} (${charCode}) => ${encryptedValue}\n`;
    }

    // Decryption: M = C^d mod n
    let decryptedValues = [];
    let decryptionSteps = ''; // Modify to a string to store one step for each letter
    for (let i = 0; i < encryptedValues.length; i++) {
        const decryptedValue = modPow(encryptedValues[i], dValue, nResult);
        decryptedValues.push(decryptedValue);

        // Add one decryption step details to the string 
        decryptionSteps += `${String.fromCharCode(decryptedValue)} (${encryptedValues[i]}) => ${decryptedValue}\n`;
    }

    const imageContainer = document.getElementById('imageContainer');
    if (imageContainer.childElementCount === 0) {
        const imageElement = document.createElement('img');
        imageElement.src = 'rsa.jpg'; // Replace 'path/to/your/image.jpg' with the actual path to your image
        imageElement.alt = 'Encrypted Image';
        imageElement.style.width = '300px'; // Set the desired width
        imageContainer.appendChild(imageElement);
    }
    const resultText = `
      Converted Plaintext to ASCII Values: 
      ${plaintextASCII}
      
      <span> Value of n: ${nResult}</span>
      To get the value of n, you can use the formula: 
      n = p * q 
      = ${pValue} * ${qValue}
      = ${nResult}
      
      <span>Value of φ(n): ${tResult}</span>
      To get the value of φ(n), you can use the formula: 
      φ(n) = (p - 1) * (q - 1) 
      = (${pValue} - 1) * (${qValue} - 1)
      = ${pValue - 1} * ${qValue - 1} 
      = ${tResult}

      <span>Value of d: ${dValue}</span>
      To get the value of d, you can use the formula:
      d = (φ(n) * 1 + 1) / e
      = (${originalTResult} * 1 + 1) / ${eValue}
      = ${dValue}  .:${rounds}
      
      Encryption Formula: C = M^e mod n
      Encrypted Values (C): <span>${encryptedValues.join(', ')}</span>
      Encryption Steps:
      <span>${encryptionSteps}</span>

      Decryption Formula: M = C^d mod n
      Decrypted Values (M): <span>${decryptedValues.join(', ')}</span>
      Decryption Steps:
      <span>${decryptionSteps}</span>

      PlainText: <span>${plaintext}</span>
      M: <span>${plaintext.split('').map(char => char.charCodeAt(0)).join(', ')}</span>
      C: <span>${encryptedValues.join(', ')}</span>

      <center><button onclick="resetValues();" class="button-85">RESET</button></center>
    `;

    document.getElementById('result').innerHTML = resultText;




}

// Constant for the result text modification
const resultTextmod = `<center><br><button onclick="resetForm()" class="button-85">Reset</button></center>`;


// Function to calculate the modulus
function calculateModulus(dividend, exponent, divisor) {
    // Step 1: Check if the divisor is zero
    if (divisor === 0) {
        return "Cannot divide by zero. Please enter a non-zero divisor.";
    }

    // Step 2: Calculate the modulus using a loop
    var result = 1;

    for (var i = 0; i < exponent; i++) {
        result = (result * dividend) % divisor;
    }

    // Step 3: Create a string to show the steps and the result
    var solution = `Step 1: Check if the divisor is zero.\n`;
    solution += divisor === 0 ? "   Divisor is zero. Cannot proceed.\n" : "   Divisor is non-zero. Continue to step 2.\n";
    solution += `Step 2: Calculate the modulus using a loop.\n`;

    // Calculate the result using BigInt to handle large numbers
    var bigintResult = BigInt(1);
    for (var i = 0; i < exponent; i++) {
        bigintResult = (bigintResult * BigInt(dividend)) % BigInt(divisor);
    }

    solution += `   Modulus = (${dividend}^${exponent}) % ${divisor} = ${bigintResult}\n`;

    solution += `\nStep 3: Result.\n`;
    solution += `   The modulus of (${dividend}^${exponent}) divided by ${divisor} is ${bigintResult.toString()}`;

    // Append the constant resultTextmod
    solution += resultTextmod;

    // Step 4: Return the result
    return solution;
}

// Function to handle the button click and perform the calculation
function calculate() {
    // Get the values from the input fields
    var dividend = document.getElementById('dividend').value;
    var exponent = document.getElementById('exponent').value;
    var divisor = document.getElementById('divisor').value;

    // Convert the input values to numbers
    dividend = parseFloat(dividend);
    exponent = parseFloat(exponent);
    divisor = parseFloat(divisor);

    // Call the modulus calculator function
    var result = calculateModulus(dividend, exponent, divisor);

    // Display the steps and the result
    document.getElementById('calculationSteps').innerHTML = result.replace(/\n/g, '<br>');
}

// Function to reset the form
function resetForm() {
    // Clear the input fields
    document.getElementById('dividend').value = "";
    document.getElementById('exponent').value = "";
    document.getElementById('divisor').value = "";

    // Clear the calculation steps and result
    document.getElementById('calculationSteps').innerHTML = "";
}