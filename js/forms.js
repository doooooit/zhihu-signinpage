function Account(obj) {
    this.username = obj.username;
    this.account = obj.account;
    this.pwdmd5 = obj.pwdmd5;
    this.toString = () => JSON.stringify(this);
}

// 新近账号对象
function createAccount() {
    if (1 == arguments.length) {
        return new Account(arguments[0]);
    } else if (3 == arguments.length) {
        var obj = {
            username: arguments[0],
            account: arguments[1],
            pwdmd5: toMD5(arguments[2])
        }
        return new Account(obj);
    } else {
        return null;
    }
}


// 验证账号是否存在，不存在则新建成功，账号信息存入 localStorage
export function signup(username, account, pwd) {
    var accountObj = localStorage.getItem(account);
    if (null === accountObj) {
        accountObj = createAccount(username, account, pwd);
        localStorage.setItem(accountObj.account, accountObj.toString());
        return true;
    } else {
        return false;
    }
}


// 验证登陆是否成功
export function signin(account, pwd) {
    var accountObj = JSON.parse(localStorage.getItem(account));
    if (!accountObj) {
        return false;
    } else if (toMD5(pwd) === accountObj.pwdmd5) {
        return true;
    } else {
        return false;
    }
}


// 验证表单输入是否合法
export function inputTest(username, account, pwd) {
    // 错误信息
    // 返回 0 表示一切正常
    // 返回 1 表示字段为空
    // 返回 2 表示格式错误
    var errInfo = '';

    // 用于账号合法性验证
    var telReg = /\d{11}/;
    var emailReg = /[\w\.\_\-]+@\w+\.[a-zA-Z]+?[\.a-zA-Z]*?[a-zA-Z]+$/;

    String.prototype.getLength = function() {
        var length = {
            len: 0,
            characters: 0,
            letters: 0
        };

        for (var i = 0; i < this.length; i++) {
            if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
                length.len += 2;
                length.characters++;
            } else {
                len++;
                length.letters++;
            }
        }
        return length;
    }

    var namelen = username.getLength();
    if (0 == namelen.len) {
        errInfo += '1';
    } else if (1 == namelen.len || (2 == namelen.len && 0 == namelen.characters)){
        errInfo += '2';
    } else {
        errInfo += '0';
    }
    if (!account) {
        errInfo += '1';
    } else if (!(telReg.test(account) || emailReg.test(account))) {
        errInfo += '2';
    } else {
        errInfo += '0';
    }
    if (!pwd) {
        errInfo += '1';
    } else if (pwd.length < 6 || pwd.length > 128) {
        errInfo += '2';
    } else {
        errInfo += '0';
    }

    return errInfo;
}
