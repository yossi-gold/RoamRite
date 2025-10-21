

export const convert = (passedDate) => {
    return {
        fullDate: new Date(passedDate).toLocaleString("en-US", { month: "short", year: "numeric" }),
        year: new Date(passedDate).getFullYear(),
        month: new Date(passedDate).toLocaleString("en-US", { month: "short" }),

    }
}