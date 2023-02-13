export const format = (value) => {
    let formattedValue

    formattedValue = value.replace(',','.')
    formattedValue = Number(formattedValue.split('R$')[1].trim())

    formattedValue = String(value).includes('-') ? -formattedValue : formattedValue

    return formattedValue
}