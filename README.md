# DevOps & Cloud Computing Project Summary

In the 'my-notes-app' branch of this repository there is code for a simple React application that has been deployed with AWS. An AWS CodePipeline was configured so that on a push to the 'my-notes-app' branch of this repository, the code will built and deployed. Rather than focusing on building an advanced React application, the focus was on building a CI/CD pipeline in AWS and gaining familiarity with AWS tools and how they can be assembled to host a web application.  

The following outlines the file structure of the project, the tools that were used in order to accomplish this, and the roadblocks that were encountered along the way. 
Also see **Issues** for specific breakdowns and screenshots of the challenges I faced.

## Project Structure

The application's codebase resides within the `TEST2/my-notes-app` directory, to separate the project from others in the repository. Because there were multiple variations of the my-notes-app, the TEST2 folder was used to distinguish between them. TEST2/my-notes-app contains the code that was deployed to AWS. 

Within `TEST2/my-notes-app`, the structure is as follows:

- **`src/`**: Contains the source files written in React, including the main components, application logic, and state management. It's the heart of the React application.
- **`public/`**: Houses static assets such as the `index.html` file, icons, and manifest files necessary for the web application.
- **`build/`**: Generated upon running the build command, this directory holds the compiled production-ready code after transpilation and minification processes.
- **`node_modules/`**: Includes all the dependencies of the project as specified in the `package.json` file, installed via `npm install`.
- **`Dockerfile.aws2`**: This is the Dockerfile specifically crafted for AWS deployment. It details the instructions for building the Docker image used by AWS ECS for running the application in containers.
- **`package.json`** and **`package-lock.json`**: Define the project dependencies and lock them to specific versions, ensuring consistent installs across environments.
- **`README.md`**: Provides documentation for the project, including setup instructions, project description, and usage guidelines.
  
### Tools and Technologies

The deployment of this React application utilizes many AWS services, including:

- **AWS CodePipeline**: Orchestrates the build, test, and deployment phases when code is pushed to the 'my-notes-app' branch of the repository.
- **AWS CodeBuild**: Compiles the source code, runs tests, and produces a deployable version.
- **AWS Elastic Container Service (ECS)**: Manages the containerized application, handling its deployment, scaling, and management.
- **AWS Elastic Container Registry (ECR)**: Stores the Docker container images that are built by CodeBuild and pulled by ECS.
- **AWS Elastic Load Balancing (ELB)**: Distributes incoming application traffic across multiple targets, in different availability zones.

### Encountered Challenges

Throughout the development and deployment process, several challenges were faced:

- **Dockerfile Configuration**: One of the primary challenges in getting this to work was the configuration of a Dockerfile. Previous versions (ex: Dockerfile.aws) remain in the repository that attempt to use Amazon Linux and Elastic Beanstalk to deploy the React Application. Running that Dockerfile on the M1 Mac caused difficulties and ultimately led to the use of Dockerfile.aws2 for the deployment. Dockerfile.aws2 relies on Node-18 Alpine and needs to be built with the platform flag like this: **'docker build -f Dockerfile.aws2 --platform linux/amd64 -t my_notes_app .'** This way the container can be built for x86 and will integrate smoothly with the settings that were configured in AWS.
- **Pipeline Optimization**: Another challenge was with getting the deploy to work in the pipeline. The package.json file ran the baulking-install script alongside the start and development scripts. This was causing issues with the deployment in AWS and needed to be removed in order to successfully deploy the application. In addition, the pipeline looks for files that it needs to manage the continuous deployment in the root of the repository NOT the root of the project. Those are different since the root of the project is TEST2/my-notes-app. This requires changes to Buildspec.prod.yml that change directories in order to navigate this complex file structure and still create the configuration files that AWS is looking for in the correct location (the root of the repository). 
- **Security Group Configuration**: The configuration of AWS resources was straightforward at the beginning but became challenging once a user attempted to connect to them. All of the logs were correct, all targets were healthy and active and all tasks were correctly configured and alive. The infrastructure was torn down and built back up several times in an attempt to locate misconfiguration, however none was found. The issue turned out to be in the Security Group inbound rules. Although there was already a rule that allowed for inbound connections from any ip address to any ip address, a seperate more specific rule had to be added that specified the specific ip address and then the resources loaded. The interesting thing was that after the CodePipeline was configured and the deployment was successful, the DNS name for the elastic load balancer didn't load again. When I looked at the security group configuration, I observed that the rule I had previously added was gone so I added it again and then the DNS name resolved and the React application loaded.
  
## Here are the resources that helped to configure the AWS architecture:
- [CI/CD Pipeline with CodePipeline in AWS](https://dev.to/mubbashir10/set-up-ci-cd-for-containerized-react-app-using-docker-aws-codebuild-aws-ecs-aws-codepipeline-github-2p11)
- [Deploy React Application to Fargate with AWS](https://dev.to/mubbashir10/deploy-your-react-app-to-ecs-fargate-38p9)

