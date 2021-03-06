//login.js
//获取应用实例
import api from "../../utils/api.js"
var app = getApp()
var util = require('../../utils/util.js');
Page({
    data: {
        remind: '加载中',
        help_status: false,
        userid_focus: false,
        passwd_focus: false,
        number: '',
        idCard: '',
        angle: 0
    },

    onLoad: function (options) {
        wx.request({
            url: api.repairflurl,
            success: function (res) {
            }
        })
    },
    onReady: function () {
        var _this = this;
        setTimeout(function () {
            _this.setData({
                remind: ''
            });
        }, 1000);
        wx.onAccelerometerChange(function (res) {
            var angle = -(res.x * 30).toFixed(1);
            if (angle > 14) { angle = 14; }
            else if (angle < -14) { angle = -14; }
            if (_this.data.angle !== angle) {
                _this.setData({
                    angle: angle
                });
            }
        });
    },
    // 获取输入账号  
    stunumInput: function (e) {
        this.setData({
            number: e.detail.value
        })
    },

    // 获取输入密码  
    passwordInput: function (e) {
        this.setData({
            idCard: e.detail.value
        })
    },
    inputFocus: function (e) {
        if (e.target.id == 'number') {
            this.setData({
                'userid_focus': true
            });
        } else if (e.target.id == 'idCard') {
            this.setData({
                'passwd_focus': true
            });
        }
    },
    inputBlur: function (e) {
        if (e.target.id == 'number') {
            this.setData({
                'userid_focus': false
            });
        } else if (e.target.id == 'idCard') {
            this.setData({
                'passwd_focus': false
            });
        }
    },
    tapHelp: function (e) {
        if (e.target.id == 'help') {
            this.hideHelp();
        }
    },
    showHelp: function (e) {
        this.setData({
            'help_status': true
        });
    },
    hideHelp: function (e) {
        this.setData({
            'help_status': false
        });
    },
    // 登录  
    login: function () {
        var number = this.data.number;
        var idCard = this.data.idCard;
        if (this.data.number.length == 0 || this.data.idCard.length == 0) {
            wx.showToast({
                title: '账户/密码错误',
                icon: 'loading',
                duration: 500
            })
            return;
        }
        wx.request({
            url: api.loginurl,
            method: 'GET',
            data: {
                number: this.data.number,
                idCard: this.data.idCard
            },
            success: (res) => {
                var that = this;
                console.log(res);
                var message = res.data.meta.message;
                var type = res.data.data.type
                if (message == "ok" && type == "硕士") {
                    console.log(this.data.idCard)
                    app.globalData.username = that.data.number;
                    console.log(app.globalData.username);
                    wx.switchTab({
                        url: '../index/index',
                    })
                } else if (message == "ok" && type == "维修工") {
                    wx.switchTab({
                        url: '../wxWorker/wxWorker',
                    })
                }
            },
            error: (res) => {
                console.log(res)
            }
        })
    }
})