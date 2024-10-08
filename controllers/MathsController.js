import Controller from './Controller.js';
import MathsApi from '../wwwroot/API_Maths.js';

export default class MathsController extends Controller {
    async get(id) { 
        let { op, x, y, n } = this.HttpContext.path.params || {};
        let result;
        let error;


        if (op === ' ') {
            op = '+';
        }

        if (typeof op === 'undefined' && typeof x === 'undefined' && typeof y === 'undefined' && typeof n === 'undefined'){
            const testResults = await MathsApi.runTests();
        
            let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Math API Test Results</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        margin: 20px;
                    }
                    h1 {
                        color: #333;
                        text-align: center;
                    }
                    button {
                        display: block;
                        margin: 10px auto;
                        padding: 10px 20px;
                        background-color: #007bff;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                    }
                    button:hover {
                        background-color: #0056b3;
                    }
                    legend {
                        font-size: 1.2em;
                        margin-bottom: 10px;
                    }
                    fieldset {
                        border: 1px solid #ccc;
                        padding: 10px;
                        margin-top: 20px;
                    }
                    .test-result {
                        margin: 5px 0;
                        padding: 5px;
                        font-family: monospace;
                        border-bottom: 1px dashed #ccc;
                    }
                </style>
            </head>
            <body>
                <h1>Math API Test Results</h1>
                <button>Aide</button>
                <fieldset>
                    <legend>Test</legend>
            `;

            for (const result of testResults) {
                const { op, x, y, n, value, error } = result; // Include expectedError
            
                // Constructing the result string conditionally based on available parameters
                let resultString = `OK ---> {"op": "${op}", `;
                if (x !== undefined) resultString += `"x": ${x}, `;
                if (y !== undefined) resultString += `"y": ${y}, `;
                if (n !== undefined) resultString += `"n": ${n}, `;
                
                // Check for expectedError and display it instead of value if it exists
                if (error) {
                    resultString += `"error": "${error}"`;
                } else {
                    resultString += `"value": ${value}`;
                }
                
                resultString += `}`; // Close the JSON object
            
                htmlContent += `
                    <div class="test-result">
                        ${resultString}
                    </div>
                `;
            }

            htmlContent += `
                </fieldset>
            </body>
            </html>
            `;

            this.HttpContext.response.end(htmlContent);
            return;
        }

        if (['+', '-', '*', '/', '%'].includes(op.trim())) {
            if (isNaN(x) || isNaN(y)) {
                error = "'x' and/or 'y' parameters are not valid numbers.";
            }
        }
        
        if (['!', 'p', 'np'].includes(op.trim())) {
            if (isNaN(n)) {
                error = "'n' parameter is not a valid number.";
            } else if (parseInt(n) <= 0) {
                error = "'n' parameter must be greater than 0.";
            }
        }
        
        switch (op.trim()) {
            case '+':
                result = parseFloat(x) + parseFloat(y);
                break;
            case '-':
                result = parseFloat(x) - parseFloat(y);
                break;
            case '*':
                result = parseFloat(x) * parseFloat(y);
                break;
            case '/':
                if (y === '0' || parseFloat(y) === 0) {
                    error = "Division by zero results in infinity";
                } else if (isNaN(parseFloat(x)) || isNaN(parseFloat(y))) {
                    error = "Invalid number for division";
                } else {
                    result = parseFloat(x) / parseFloat(y);
                }
                break;
            case '%':
                if (isNaN(parseFloat(x)) || isNaN(parseFloat(y))) {
                    error = "Modulus operation resulted in NaN due to invalid numbers";
                } else {
                    result = parseFloat(x) % parseFloat(y);
                }
                break;
            case '!':
                if (parseInt(n) < 0) {
                    error = "'n' must be greater than or equal to 0 for factorial";
                } else {
                    result = factorial(parseInt(n));
                }
                break;
            case 'p':
                if (parseInt(n) <= 0) {
                    error = "'n' must be greater than 0 to check if prime";
                } else {
                    result = isPrime(parseInt(n));
                }
                break;
            case 'np':
                if (parseInt(n) <= 0) {
                    error = "'n' must be greater than 0 to find nth prime number";
                } else {
                    result = findPrime(parseInt(n));
                }
                break;
            default:
                error = "Unknown operation";
                break;
        }

        this.HttpContext.response.JSON({ op, x, y, n, value: result , error: error});
    }
}
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
}

function isPrime(value) {
    for (let i = 2; i < value; i++) {
        if (value % i === 0) return false;
    }
    return value > 1;
}

function findPrime(n) {
    let primeNumber = 0;
    for (let i = 0; i < n; i++) {
        primeNumber++;
        while (!isPrime(primeNumber)) primeNumber++;
    }
    return primeNumber;
}