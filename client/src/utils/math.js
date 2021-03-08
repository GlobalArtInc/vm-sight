export function BiteToGb(number) {
    return parseFloat(String(number/1024/1024/1024)).toFixed(2) + ' GB'
}