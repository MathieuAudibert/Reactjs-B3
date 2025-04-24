export function genereRIB() {
    const prefix = "BWK92-"
    const chiffres = Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
    return prefix + chiffres
}

export function convertTimestamp(timestamp) {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleString(); 
  }