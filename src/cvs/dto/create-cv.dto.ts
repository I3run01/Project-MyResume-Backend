type CvsDto = {
    userId: string
    name: string
    personalDatas: {
        fullName: string,
        birthday: string,
        location: string,
        number: string,
    }
    resume: string
    college: {
        trainningArea: string
        collegeName: string
        graduationYear: string
    }[]
    languages: {
        language: string
        level: string 
    }[]
    abilities: string[]
    socialMedias: {
        title: string
        link: string
    }[]
}

export default CvsDto
