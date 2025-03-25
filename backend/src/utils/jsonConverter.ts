export function jsonToText(json: object): string {
  const text = JSON.stringify(json, null, 2);
  return text;
}

export function textToJson(text: string): any {
  try {
    const json = JSON.parse(text);
    return json;
  } catch (error) {
    console.error('Error converting text to json: ', error.message);
    return null;
  }
}
