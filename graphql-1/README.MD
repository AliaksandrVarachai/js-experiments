## Queries/Mutations

#### Body
```graphql
query myQuery($myColor: ColorType, $myName: String = "Sasha") {
  students {
    id
    # firstName
    # lastName
    fullName
    # email
    # password
    # collegeId
    college {
      # id
      name
      location
      rating
    }
  }
  colleges {
    id
    name
  }
  
  studentById(id: "S1001") {
    id 
    # firstName
    # lastName
    fullName
  }
  
  sayHello(name: $myName)
  setFavouriteColor(color: $myColor)
}

mutation addJim {
  createStudent(collegeId: "col-2", firstName: "Jim", lastName: "Hokkins")
}

mutation addJimObject {
  createStudentObject(collegeId: "col-101", firstName: "Jim-2", lastName: "Hokkins-2") {
    id
    fullName
  }
}

mutation deleteStudent {
  deleteStudent(id: "rJjkKeMG8")
}
```

#### Variables
```json
{
  "myName": "Alexandr",
  "myColor": "RED"
}
```
