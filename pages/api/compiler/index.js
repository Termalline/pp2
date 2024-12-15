import fs from 'fs';
import {getFileExtension} from "@/utils/run_code";
import {getCommands} from "@/utils/run_code";
import {createChildProcess} from "@/utils/run_code";
import { exec } from 'child_process';


/*
Returns stdout & stderr given the language, code, and stdin(optional).
*/
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }
    const {language, code, stdin } = req.body;

    // Enforces that language and code are provided
    if (!language || !code) {
        return res.status(400).json({ error: "'language' and 'code' are required" });
    }
    // Disregard case-senstivity
    var lang = language.toString().toLowerCase();

    // Makes sure language is either python, javascript, c, java, or c++/cpp
    if(lang != 'python' && lang !== 'javascript' && lang !== 'c' && lang !== 'cpp' && lang !== 'java' && lang !== 'c++'&& lang !== 'r' && lang !== 'ruby' && lang !== 'perl' && lang !== 'go' && lang !== 'perl'&& lang !== 'rust') {
        return res.status(400).json({ error: "Invalid language. language must be either 'python', 'javascript', 'c', 'cpp'/'c++', or 'java'" });
    }                                              

    if(lang === 'c++') {
        lang = 'cpp';
    }

    
    // Get the file extension and create commands to run the shell
    var ext = getFileExtension(lang);
    var PATH_NAME = `./execution/output.${ext}`;
    var file_path = getCommands(lang, PATH_NAME);
    
    // Write stdin to a file
    fs.writeFileSync("./execution/stdin.txt", "");
    if(stdin) {
        fs.appendFileSync("./execution/stdin.txt", stdin);
    }
    // Write the code to a file
    fs.writeFileSync(PATH_NAME, code);
    
    // Run the shell command and return the output
    //return res.status(200).json({ output: await createChildProcess(file_path) });

    const sleep = s => new Promise(resolve => {
        setTimeout(resolve, s * 1000)
    });

    
    // https://stackoverflow.com/questions/72125611/how-to-wait-end-of-promise-but-with-timeout
    Promise.race([createChildProcess(file_path), sleep(10)]).then(result => {
        if (result === undefined) { // Timeout of 10 seconds occurred 
             // Some message to the user?
             var file_path = "bash stop_container.sh"
             exec(file_path)
             return res.status(200).json({ output: "timed out" });
        } else { // Got reply within 10 seconds
             // Do something with the result
             var file_path = "bash stop_container.sh"
             exec(file_path)
             return res.status(200).json({output: result});
        }
    });


}





