import {download} from "./utils";

const url1 = "https://www.youtube.com/shorts/TX0oX0CNmeY";

const url2 = "https://www.youtube.com/watch?v=9i_2XGb28Pg&t=1s";

async function appStart() {
    download(url1)
}

appStart();


