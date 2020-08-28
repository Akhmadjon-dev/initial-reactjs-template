const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const baseUrl = process.env.REACT_APP_baseUrl || '';

exports.deleteImg = (img) => {
  let dir = `../public${img}`
  if (process.env.NODE_ENV !== 'development') {
    dir = `/var/www/${img}/`
  }
  const imgPath = path.join(__dirname, dir);
  if (fs.existsSync(imgPath) && img) {
    fs.unlinkSync(imgPath);
  }
};

exports.resizeImg = (img, imgType) => {
  if (img) {
    const { path: imgPath, destination, filename } = img;
    const customeSize = imgType === 'banner' ? { width: 720, height: 405 } : { width: 200, height: 200 };
    const fileExtension = path.extname(filename);
    const imgName = filename.slice(0, filename.lastIndexOf('.'));
    const newImgPath = `${destination + imgName}-resized${fileExtension}`;

    sharp(imgPath)
      .resize({
        ...customeSize,
        fit: 'contain',
        background: '#ffffff',
      })
      .jpeg({ quality: 50, force: false })
      .png({ quality: 50, force: false })
      .toFile(newImgPath)
      .then(() => {
        this.deleteImg(imgPath);
        fs.renameSync(newImgPath, `${destination + imgName}${fileExtension}`);
      })
      .catch((err) => console.log('ERRRO', err));
  }
};

exports.imgFileFromBase64 = (dataurl, filename) => {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, {
    type: mime,
  });
};

exports.webImgtoFile = (str, category, name, edit, oldImg) => {
  const dir = `public/uploads/${category}/`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const fileName = name.toLowerCase().replace(/\s+/g, '-');
  if (!edit) {
    const data = Buffer.from(str.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
    fs.writeFileSync(`./public/uploads/${category}/${fileName}.jpg`, data);
    return `${baseUrl}/uploads/${category}/${fileName}.jpg`;
  }
  const fielExist = fs.existsSync(`public${oldImg}`);

  if (fielExist && oldImg) {
    fs.unlinkSync(`public${oldImg}`);
  }
  const data = Buffer.from(str.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
  fs.writeFileSync(`./public/uploads/${category}/${fileName}-edited.jpg`, data);
  return `${baseUrl}/uploads/${category}/${fileName}-edited.jpg`;
};

exports.authHandler = (req, res, next) => {
  const whiteList = ['/auth/sign-in', '/auth/sign-up', '/dashboard', '/admins'];
  console.log(req.session, req.url);

  if (!whiteList.includes(req.url)) {
    const { userId, loggedIn } = req.session;
    if (userId && loggedIn) {
      return next();
    }
    return res.json({
      type: 'auth',
      msg: 'You need to login/sign up first',
      success: false,
    });
  }
  return next();
};