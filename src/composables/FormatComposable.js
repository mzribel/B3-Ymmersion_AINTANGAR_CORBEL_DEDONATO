const FormatComposable = () => {

    const ToArray = (obj) => {
        let result = [];
        if (!obj) { return result }

        Object.keys(obj).forEach(key => {
            obj[key]["uid"] = key;
            result.push(obj[key])
        })

        return result;
    }
    return {ToArray};
}


export default FormatComposable;