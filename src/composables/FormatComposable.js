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

    const toDate = (seconds) => {
      return (new Date(seconds)).toLocaleString();
    }

    const isToday = (seconds) => {
        return new Date().toDateString() === new Date(seconds).toDateString();
    }


    const getDateAndTimeString = (seconds) => {
        let date = new Date(seconds)
        return {
            "time": date.toLocaleTimeString("fr-FR", {hour: '2-digit', minute:'2-digit'}),
            "date": date.toLocaleDateString("fr-FR")
        }
    }

    return {ToArray, toDate, isToday, getDateAndTimeString };
}


export default FormatComposable;