type CvsDto = {
    userId: string
    name: string
    personalDatas?: {
        fullName: string,
        birthday: string,
        location: string,
        phone: string,
    }
    resume?: string
    colleges?: {
        trainningArea: string
        collegeName: string
        graduationYear: string
    }[]
    languages?: {
        language: string
        level: string 
    }[]
    abilities?: string[]
    socialMedias?: {
        title: string
        link: string
    }[]
}

export default CvsDto
