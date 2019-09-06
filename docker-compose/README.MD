# Frontend Service

## Isolated creation & test 

Build an image:
```
cd frontend-service
docker build -t frontend-service . 
```  

Start a container:
```
doc docker run -p 8081:8081 frontend-service
```

Go to http://localhost:8081 to see an html page.

## 

