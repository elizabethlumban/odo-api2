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
            image 'build_worker:1.0'
        } 
    }
    stages {
        stage('checkout') {
            //when coding the jenkins file in a single branch project, will need to manually checkout
            when{ expression {"${manualCheckout}" == "true"}} 
            steps{
                git branch: 'colin', url: 'https://github.com/chobdayIbm/odo-api2.git'
                sh "ls -la"
            }
            //TODO github hook
            // need jenkins github read account
        }
        stage('install dep') {
            steps {
                sh 'make _install'
                // updateCommitStatus("success", 'Dependencies download successfully.', context)
            }
        }
        stage('check') {
            parallel {
                stage('audit') {
                    steps {
                        sh 'make _audit'
                    }
                }
                stage('lint') {
                    steps {
                        sh 'make _lint'
                    }
                }
                stage('test') {
                    steps {
                        sh 'make _test'
                    }
                }
                stage('openapi') {
                    when{ expression {"TODO" == "true"}} 
                    steps {
                        sh 'make _validate_openapi'
                    }
                }
            }
        }
        stage('compile') {
            steps {
                sh 'make _build'
            }
        }
        stage('Building image') {
            steps{ sh "make _build_container"}
        }
        stage('Deploy application') {
            steps{
                withCredentials([ 
                    usernamePassword(
                        credentialsId: 'DockerCredentials',
                        passwordVariable: 'DOCKER_PASSWORD',
                        usernameVariable: 'DOCKER_ID',
                    ),
                    string(
                        credentialsId: 'openshift_jenkins',
                        variable: 'OC_TOKEN',
                    ),
                ]) { sh "make deploy" }
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
    }
}
