enum Role {
  ADMIN,
  READ_ONLY,
  AUTHOR
}

type UserData = [username: string, role: Role, Date: Date];