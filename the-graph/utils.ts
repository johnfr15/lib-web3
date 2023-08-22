export const parse_args = (args: Object): String => {
    const arr = Object.entries(args)
    
    return arr.reduce((prev, next) => 
    {
        if (typeof next[1] == "object")
            return prev + next[0] + ":" + "{" + parse_args(next[1]) + "}" 
        else
            return prev +=  next[0] + ":" + next[1] + ","
    }, "")
}