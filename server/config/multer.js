import multer from "multer";

const storage = multer.diskStorage({});

const uploadFile = multer({storage})

export default uploadFile;