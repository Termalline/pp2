import { exec } from 'child_process';

// Returns the file extension given the language
export function getFileExtension(language) {
    switch (language) {
        case 'python': return 'py';
        case 'javascript': return 'js';
        case 'java': return 'java';
        case 'c': return 'c';
        case 'cpp': return 'cpp';
        case 'ruby': return 'rb';
        case 'rust': return 'rs';
        case 'r': return 'r';
        case 'php': return 'php';
        case 'go': return 'go';
        case 'perl': return 'pl';
        default: throw new Error('Unsupported language');
    }
}


// Returns the command line given the language and file path
export function getCommands(language, filePath) {
    switch (language) {
        case 'python': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ python_dockerfile"
        case 'javascript': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ node_dockerfile"
        case 'java': return  "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ java_dockerfile"
        case 'c': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ c_dockerfile" 
        case 'cpp': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ cpp_dockerfile"
        case 'ruby': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ ruby_dockerfile"
        case 'rust': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ rust_dockerfile"
        case 'r': return  "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ r_dockerfile"
        case 'php': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ php_dockerfile" 
        case 'go': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ go_dockerfile"
        case 'perl': return "docker run -m 100m -v //c/Users/ispld/onedrive/documents/xietimot/pp2/execution/:/app/ perl_dockerfile"
        default: throw new Error('Unsupported language');
    }
}

// Returns the stdout & stderr of the shell command via a child process
// https://stackoverflow.com/questions/71188892/how-to-wait-for-node-exec-response
export function createChildProcess(file_path){
    return new Promise((resolve) => {
        exec(file_path, (err, stdout, stderr) => {
            if (err) {
                resolve(stdout + stderr);
              } else {
                resolve(stdout + stderr);
              }
           });
         });
}


