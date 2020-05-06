#softwares to install :

1) install java jdk-11 or above version : https://www.oracle.com/in/java/technologies/javase-downloads.html
2) download sonarqube(LTS version) : https://www.sonarqube.org/downloads/
3) download sonar-scanner : https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/


#Steps to setup the sonarqube :

1) downloaded sonarqube folder : 
    replace a property in wrapper.conf file[path: sonarqube/conf/wrapper.conf]
    replace [wrapper.java.command=java] with [wrapper.java.command=%JAVA_HOME location%\java]
    
    e.g
    wrapper.java.command=C:\Program Files\Java\jdk-12.0.2\bin\java 
    
    
2) downloaded sonar-scanner folder: 
    add below two properties in sonar-scanner.properties file[path: sonar_scanner/conf/sonar-scanner.properties]
    
    sonar.host.url=http://localhost:9000
    
    sonar.sourceEncoding=UTF-8
    

3) create a sonar-project.properties file in root location of your nodejs app.
    This file gets scanned by sonar-scanner to generate report. 
    add below properties to the file and change it's values as per your application.
    e.g.
    
    sonar.projectKey=sonar-test-app
    
    sonar.projectVersion=1.0
    
    sonar.sourceEncoding=UTF-8
    
    sonar.language=js
    
    sonar.sources=./../sonarqube-codeSmells-codeCoverage
    
    sonar.exclusions=sonarqube-codeSmells-codeCoverage/node_modules/*, sonarqube-codeSmells-codeCoverage/.idea,\
      yarn.lock*, sonarqube-codeSmells-codeCoverage/client_ui/node_modules
      
      
4) start sonarqube server :
    delete data, logs, temp folders from sonarqube folder for clean start.
    use Administrator commandline to execute following commands :
    go to sonarqube/bin/windows-x86-64 and run following .bat files(for clean start of server)
    
    > stopNTService
    
    > UninstallNTService
    
    > InstallNTService
    
    > StartSonar
    
    
5) run sonar-scanner :
    set <your_dir_path>/sonar-scanner/bin in environment varriable 'path' so we can access sonar-scanner command anywhere.
    
    e.g 'F:\minal\technical\under-construction\sonar-softwares\sonar-scanner-4.3.0.2102-windows\bin' in path varriable(environment varriable)
    
    go to root directory of your project folder where you have created the `sonar-projects.properties` file and run the below command:
    
    > sonar-scanner
    
    
6) After successful report creation, you will get an url in console.
    access the url to get the report.
    
    e.g http://localhost:9000/dashboard?id=sonar-test-app