pipeline {
    environment {
        registry = "chobday" 
        registryCredential = 'DockerCredentials'
        repository = "backend-api"
        tag = "0.${env.BUILD_NUMBER}"
        imageVersion = "${registry}/${repository}:${tag}" //must be lowercase
        dockerImage = ''
        notificationEmails = "chobday@sg.ibm.com"

    }
    agent { 
        docker { 
            image 'ernesen/migratecf:3.0'
        } 
    }
    stages {
        stage('Checkout code') {
            //when coding the jenkins file in a single branch project, will need to manually checkout
            when{ expression {"${manualCheckout}" == "true"}} 
            steps{
                git branch: 'colin', url: 'https://github.com/chobdayIbm/odo-api2.git'
                sh "ls -la"
            }
            //TODO github hook
        }
        stage('Building image') {
            steps{
                echo "docker build"
                sh "ls -la "
                script {dockerImage = docker.build "$imageVersion"}
            }
        }
        stage('Deploy image') {
            steps{
                echo "docker push"
                script {
                    docker.withRegistry( '', registryCredential ) {
                        dockerImage.push()
                        dockerImage.push('latest')
                    }
                }
            }
        }
        stage('Send Slack notifications') {
            steps{
                slackSend (color: '#00FF00', message: "Success: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
            }
        }
    }
    post {
        failure {
            slackSend (color: '#FFC0CB', message: "FAIL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
        }
        success {
            echo 'success'
        }
    }
}
