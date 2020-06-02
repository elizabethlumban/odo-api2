pipeline {
    environment {
        registry = "chobday" 
        registryCredential = 'DockerCredentials'
        repository = "backend-api"
        tag = "0.${env.BUILD_NUMBER}"
        imageVersion = "${registry}/${repository}:${tag}" //must be lowercase
        dockerImage = ''

    }
    agent { 
        docker { 
            image 'ernesen/migratecf:3.0'
        } 
    }
    stages {
        stage('Clone code') {
            when{ expression {return false}}
            steps{
                git branch: 'colin', url: 'https://github.com/chobdayIbm/odo-api2.git'
                sh "ls -la"
            }
        }
        stage('Building image') {
            steps{
                sh "ls -la /data"
                echo "Current files"
                sh "ls -la "
                echo "docker build"
                script {dockerImage = docker.build "$imageVersion"}
            }
        }
        stage('Deploy image') {
            when{ expression {return false}}
            steps{
                echo "docker push"
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push() //TODO save space
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Send Slack notifications') {
            steps{
                // slackSend (color: '#00FF00', message: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
                notify('Send Slack notifications') //TODO should fail if this fails
            }
        }
    }
    post {
        failure {
            echo 'failure'
        }
        success {
            echo 'success'
        }
    }
}

def notify(status){
    return emailext (
      to: "chobday@sg.ibm.com",
      subject: "${status}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]'",
      body: """<p>${status}: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]':</p>
        <p>Check console output at <a href='${env.BUILD_URL}'>${env.JOB_NAME} [${env.BUILD_NUMBER}]</a></p>""",
    )
}