import fs from "fs";
import axios from "axios";
import { error } from "./log";

const apiUrl = "http://api.ttshitu.com/predict";

export const getPoint = async (imageFile: string): Promise<number[][]> => {
    let base64data = fs.readFileSync(imageFile).toString("base64");
    const {TJ_USERNAME, TJ_PASSWORD} = process.env;
    const {data: resultData} = await axios.post(apiUrl, {
        username: TJ_USERNAME,
        password: TJ_PASSWORD,
        typeid: "22",
        image: base64data
    });
    if (!resultData.success) {
        error("验证码识别失败", resultData.success);
        return [];
    }
    const point = resultData.data.result;
    return point && processPoint(point);
};

// 处理字符串坐标为数组
//   '302,473|173,524|353,306'
// => [[302,473],[173,524],[353,306]]
const processPoint = (point: string) => {
    return point?.split("|")?.map(item => {
        const [x, y] = item.split(",");
        return [Number(x), Number(y)];
    });
};