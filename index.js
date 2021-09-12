//Dependencies
const Child_Process = require("child_process")
const Fs = require("fs")

//Variables
const Self_Args = process.argv.slice(2)

//Functions
async function Is_NPM_Installed(){
    const result = new Promise(resolve =>{
        Child_Process.exec("npm -h", function(err, stdout, stderr){
            if(err){
                resolve(false)
                return
            }

            if(stdout.indexOf("More configuration info:") != -1){
                resolve(true)
            }else{
                resolve(false)
            }
        })
    })

    if(result){
        return true
    }else{
        console.log("Please install NPM.")
        process.exit()
    }
}

async function Main(){
    const requirements = Fs.readFileSync(Self_Args[0], "utf8")

    await Is_NPM_Installed()

    var full_installing = ""

    for( i = 0; i <= requirements.split("\n").length-1; i++ ){
        if(full_installing.length == 0){
            full_installing = `npm install ${requirements.split("\n")[i]}`
        }else{
            full_installing += ` && npm install ${requirements.split("\n")[i]}`
        }
    }

    const installing = Child_Process.exec(full_installing, function(err, stdout, stderr){
        console.log("Installing finished.")
    })

    installing.stdout.on("data", function(data){
        console.log(data)
    })
}

//Main
if(Self_Args.length == 0){
    console.log(`node index.js <requirements.txt_path>
Example: node index.js requirements.txt`)
    process.exit()
}

if(Self_Args[0] == ""){
    console.log("Invalid requirements.txt_path.")
    process.exit()
}

if(Self_Args[0].indexOf(".txt") == -1){
    console.log("Invalid requirements.txt_path.")
    process.exit()
}

Main()
