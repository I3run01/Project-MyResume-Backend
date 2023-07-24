type CvsDto = {
    userId: string
    name: string
    cvTitle: string
    resume: string
    objectives: string
    personalDatas?: {
        fullName: string,
        birthday: string,
        location: string,
        phone: string,
    }
    
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
    experinces: object[]
    
}

export default CvsDto
