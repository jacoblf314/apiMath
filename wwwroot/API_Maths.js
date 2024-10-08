class MathsAPI {
    static API_URL() {
        return "http://localhost:5000/api/maths";
    }

    static async runTests() {
        const tests = [
            { url: `${this.API_URL()}?op=+&x=3&y=2`},                   
            { url: `${this.API_URL()}?op=-&x=10&y=5`},                  
            { url: `${this.API_URL()}?op=*&x=5&y=6`},                   
            { url: `${this.API_URL()}?op=/&x=10&y=2`},                  
            { url: `${this.API_URL()}?op=%&x=10&y=3`},                  
            { url: `${this.API_URL()}?op=!&n=5`},                       
            { url: `${this.API_URL()}?op=p&n=7`},                       
            { url: `${this.API_URL()}?op=np&n=5`},                      
            { url: `${this.API_URL()}?op=*&x=10&y=abc`}, 
            { url: `${this.API_URL()}?op=&x=10&y=5`},  
            { url: `${this.API_URL()}?op=/&x=10&y=0`},  
            { url: `${this.API_URL()}?op=%&x=10&y=abc`}, 
            { url: `${this.API_URL()}?op=!&n=-5`}, 
            { url: `${this.API_URL()}?op=p&n=-7`}, 
            { url: `${this.API_URL()}?op=np&n=-1`}, 
        ];

        const results = []; 
        for (const test of tests) {
            try {
                const response = await fetch(test.url);
                const data = await response.json();

                let resultObject = { op: data.op, value: data.value, error: data.error};

                if (data.hasOwnProperty('x')) resultObject.x = data.x;
                if (data.hasOwnProperty('y')) resultObject.y = data.y;
                if (data.hasOwnProperty('n')) resultObject.n = data.n;

                results.push(resultObject); 
            } catch (error) {
                results.push({
                    op: '', 
                    value: null
                });
            }
        }

        return results; 
    }
}

export default MathsAPI;