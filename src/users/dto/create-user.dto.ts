type CreateUserDto = {
    name: string | null
    email: string
    password: string
    avatarImage: string | null
    status: 'Active' | 'Pending'
}

export default CreateUserDto
