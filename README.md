# Client part for MS Reference
## Project deployment

* Installing project dependencies:
    ```
    => npm install
    ```

    **P.S.** Note: if existing node_modules folder (probably containing many unnecessary modules) cannot be deleted
    (because of too long path names) you may do the following:
    ```
    => npm install -g rimraf
    => rimraf node_modules
    ```
* Building project to target/dist:
    ```
    => npm run build
    ```
* Running in debug server mode:
    ```
    => npm run serve
    ```
    **NB** Server starts on `http://localhost:4200`. 

### Setting-up Windows environment

1. Installing NodeJS;
2. Installing angular-cli:
    ```
    => npm install -g @angular/cli
    ```
    
[1]: https://nodejs.org/en/
[2]: https://github.com/angular/angular-cli
