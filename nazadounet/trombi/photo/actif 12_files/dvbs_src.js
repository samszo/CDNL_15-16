function dv_rolloutManager(handlersDefsArray, baseHandler) {
    this.handle = function () {
        var errorsArr = [];

        var handler = chooseEvaluationHandler(handlersDefsArray);
        if (handler) {
            var errorObj = handleSpecificHandler(handler);
            if (errorObj === null)
                return errorsArr;
            else {
                handler.onFailure();
                errorsArr.push(errorObj);
            }
        }

        var errorObjHandler = handleSpecificHandler(baseHandler);
        if (errorObjHandler) {
            errorObjHandler['dvp_isLostImp'] = 1;
            errorsArr.push(errorObjHandler);
        }
        return errorsArr;
    }

    function handleSpecificHandler(handler) {
        var url;
        var errorObj = null;

        try {
            url = handler.createRequest();
            if (url) {
                if (!handler.sendRequest(url))
                    errorObj = createAndGetError('sendRequest failed.', url, handler.getVersion(), handler.getVersionParamName(), handler.dv_script);
            }
            else
                errorObj = createAndGetError('createRequest failed.', url, handler.getVersion(), handler.getVersionParamName(), handler.dv_script);
        }
        catch (e) {
            errorObj = createAndGetError(e.name + ': ' + e.message, url, handler.getVersion(), handler.getVersionParamName(), (handler ? handler.dv_script : null));
        }

        return errorObj;
    }

    function createAndGetError(error, url, ver, versionParamName, dv_script) {
        var errorObj = {};
        errorObj[versionParamName] = ver;
        errorObj['dvp_jsErrMsg'] = encodeURIComponent(error);
        if (dv_script && dv_script.parentElement && dv_script.parentElement.tagName && dv_script.parentElement.tagName == 'HEAD')
            errorObj['dvp_isOnHead'] = '1';
        if (url)
            errorObj['dvp_jsErrUrl'] = url;
        return errorObj;
    }

    function chooseEvaluationHandler(handlersArray) {
        var config = window._dv_win.dv_config;
        var index = 0;
        var isEvaluationVersionChosen = false;
        if (config.handlerVersionSpecific) {
            for (var i = 0; i < handlersArray.length; i++) {
                if (handlersArray[i].handler.getVersion() == config.handlerVersionSpecific) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }
        else if (config.handlerVersionByTimeIntervalMinutes) {
            var date = config.handlerVersionByTimeInputDate || new Date();
            var hour = date.getUTCHours();
            var minutes = date.getUTCMinutes();
            index = Math.floor(((hour * 60) + minutes) / config.handlerVersionByTimeIntervalMinutes) % (handlersArray.length + 1);
            if (index != handlersArray.length) //This allows a scenario where no evaluation version is chosen
                isEvaluationVersionChosen = true;
        }
        else {
            var rand = config.handlerVersionRandom || (Math.random() * 100);
            for (var i = 0; i < handlersArray.length; i++) {
                if (rand >= handlersArray[i].minRate && rand < handlersArray[i].maxRate) {
                    isEvaluationVersionChosen = true;
                    index = i;
                    break;
                }
            }
        }

        if (isEvaluationVersionChosen == true && handlersArray[index].handler.isApplicable())
            return handlersArray[index].handler;
        else
            return null;
    }    
}

function doesBrowserSupportHTML5Push() {
    "use strict";
    return typeof window.parent.postMessage === 'function' && window.JSON;
}

function dv_GetParam(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS, 'i');
    var results = regex.exec(url);
    if (results == null)
        return null;
    else
        return results[1];
}

function dv_Contains(array, obj) {
    var i = array.length;
    while (i--) {
        if (array[i] === obj) {
            return true;
        }
    }
    return false;
}

function dv_GetDynamicParams(url) {
    try {
        var regex = new RegExp("[\\?&](dvp_[^&]*=[^&#]*)", "gi");
        var dvParams = regex.exec(url);

        var results = new Array();
        while (dvParams != null) {
            results.push(dvParams[1]);
            dvParams = regex.exec(url);
        }
        return results;
    }
    catch (e) {
        return [];
    }
}

function dv_createIframe() {
    var iframe;
    if (document.createElement && (iframe = document.createElement('iframe'))) {
        iframe.name = iframe.id = 'iframe_' + Math.floor((Math.random() + "") * 1000000000000);
        iframe.width = 0;
        iframe.height = 0;
        iframe.style.display = 'none';
        iframe.src = 'about:blank';
    }

    return iframe;
}

function dv_GetRnd() {
    return ((new Date()).getTime() + "" + Math.floor(Math.random() * 1000000)).substr(0, 16);
}

function dv_SendErrorImp(serverUrl, errorsArr) {

    for (var j = 0; j < errorsArr.length; j++) {
        var errorObj = errorsArr[j];
        var errorImp = dv_CreateAndGetErrorImp(serverUrl, errorObj);
        dv_sendImgImp(errorImp);
    }
}

function dv_CreateAndGetErrorImp(serverUrl, errorObj) {
    var errorQueryString = '';
    for (key in errorObj) {
        if (errorObj.hasOwnProperty(key)) {
            if (key.indexOf('dvp_jsErrUrl') == -1) {
                errorQueryString += '&' + key + '=' + errorObj[key];
            }
            else {
                var params = ['ctx', 'cmp', 'plc', 'sid'];
                for (var i = 0; i < params.length; i++) {
                    var pvalue = dv_GetParam(errorObj[key], params[i]);
                    if (pvalue) {
                        errorQueryString += '&dvp_js' + params[i] + '=' + pvalue;
                    }
                }
            }
        }
    }

    var windowProtocol = 'http:';
    var sslFlag = '&ssl=0';
    if (window._dv_win.location.protocol === 'https:') {
        windowProtocol = 'https:';
        sslFlag = '&ssl=1';
    }
    
    var errorImp = windowProtocol + '//' + serverUrl + sslFlag + errorQueryString;
    return errorImp;
}

function dv_sendImgImp(url) {
    (new Image()).src = url;
}

function dv_sendScriptRequest(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    var body = document.getElementsByTagName('body')[0];
    body.appendChild(script);
    // document.write('<scr' + 'ipt type="text/javascript" src="' + url + '"></scr' + 'ipt>');
}

function dv_getPropSafe(obj, propName) {
    try {
        if (obj)
            return obj[propName];
    } catch (e) { }
}

function dvBsType() {
    var that = this;
    var eventsForDispatch = {};
    this.t2tEventDataZombie = {};

    this.processT2TEvent = function (data, tag) {
        try {
            if (tag.ServerPublicDns) {
                data.timeStampCollection.push({"beginProcessT2TEvent" : getCurrentTime()});
                data.timeStampCollection.push({'beginVisitCallback' : tag.beginVisitCallbackTS});
                var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;

                if (!tag.uniquePageViewId) {
                    tag.uniquePageViewId = data.uniquePageViewId;
                }

                tpsServerUrl += '&dvp_upvid=' + tag.uniquePageViewId;
                tpsServerUrl += '&dvp_numFrames=' + data.totalIframeCount;
                tpsServerUrl += '&dvp_numt2t=' + data.totalT2TiframeCount;
                tpsServerUrl += '&dvp_frameScanDuration=' + data.scanAllFramesDuration;
                tpsServerUrl += '&dvp_scene=' + tag.adServingScenario;
                tpsServerUrl += '&dvp_ist2twin=' + (data.isWinner ? '1' : '0');
                tpsServerUrl += '&dvp_numTags=' + Object.keys($dvbs.tags).length;
                tpsServerUrl += '&dvp_isInSample=' + data.isInSample;
                tpsServerUrl += (data.wasZombie)?'&dvp_wasZombie=1':'&dvp_wasZombie=0';
                tpsServerUrl += '&dvp_ts_t2tCreatedOn=' + data.creationTime;
                if(data.timeStampCollection)
                {
                    if(window._dv_win.t2tTimestampData)
                    {
                        for(var tsI = 0; tsI < window._dv_win.t2tTimestampData.length; tsI++)
                        {
                            data.timeStampCollection.push(window._dv_win.t2tTimestampData[tsI]);
                        }
                    }

                    for(var i = 0; i< data.timeStampCollection.length;i++)
                    {
                        var item = data.timeStampCollection[i];
                        for(var propName in item)
                        {
                            if(item.hasOwnProperty(propName))
                            {
                                tpsServerUrl += '&dvp_ts_' + propName + '=' + item[propName];
                            }
                        }
                    }
                }
                $dvbs.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
            }
        } catch (e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_ist2tProcess=1', { dvp_jsErrMsg: encodeURIComponent(e) });
            } catch (ex) { }
        }
    };

    this.processTagToTagCollision = function (collision, tag) {
        var i;
        var tpsServerUrl = tag.dv_protocol + '//' + tag.ServerPublicDns + '/event.gif?impid=' + tag.uid;
        var additions = [
            '&dvp_collisionReasons=' + collision.reasonBitFlag,
            '&dvp_ts_reporterDvTagCreated=' + collision.thisTag.dvTagCreatedTS,
            '&dvp_ts_reporterVisitJSMessagePosted=' + collision.thisTag.visitJSPostMessageTS,
            '&dvp_ts_reporterReceivedByT2T=' + collision.thisTag.receivedByT2TTS,
            '&dvp_ts_collisionPostedFromT2T=' + collision.postedFromT2TTS,
            '&dvp_ts_collisionReceivedByCommon=' + collision.commonRecievedTS,
            '&dvp_collisionTypeId=' + collision.allReasonsForTagBitFlag
        ];
        tpsServerUrl += additions.join("");

        for (i = 0; i < collision.reasons.length; i++){
            var reason = collision.reasons[i];
            tpsServerUrl += '&dvp_' + reason + "MS=" + collision[reason+"MS"];
        }

        if(tag.uniquePageViewId){
            tpsServerUrl +=  '&dvp_upvid='+tag.uniquePageViewId;
        }
        $dvbs.domUtilities.addImage(tpsServerUrl, tag.tagElement.parentElement);
    };

    var messageEventListener = function (event) {
        try {
            var timeCalled = getCurrentTime();
            var data = window.JSON.parse(event.data);
            if(!data.action){
                data = window.JSON.parse(data);
            }
            if(data.timeStampCollection)
            {
                data.timeStampCollection.push({messageEventListenerCalled:timeCalled});
            }
            var myUID;
            var visitJSHasBeenCalledForThisTag = false;
            if ($dvbs.tags) {
                for (var uid in $dvbs.tags) {
                    if ($dvbs.tags.hasOwnProperty(uid) && $dvbs.tags[uid] && $dvbs.tags[uid].t2tIframeId === data.iFrameId) {
                        myUID = uid;
                        visitJSHasBeenCalledForThisTag = true;
                        break;
                    }
                }
            }

            switch(data.action){
            case 'uniquePageViewIdDetermination' :
                if(visitJSHasBeenCalledForThisTag){
                    $dvbs.processT2TEvent(data, $dvbs.tags[myUID]);
                    $dvbs.t2tEventDataZombie[data.iFrameId] = undefined;
                }
                else
                {
                    data.wasZombie = 1;
                    $dvbs.t2tEventDataZombie[data.iFrameId] = data;
                }
            break;
            case 'maColl':
                var tag = $dvbs.tags[myUID];
                //mark we got a message, so we'll stop sending them in the future
                tag.AdCollisionMessageRecieved = true;
                if (!tag.uniquePageViewId) { tag.uniquePageViewId = data.uniquePageViewId; }
                data.collision.commonRecievedTS = timeCalled;
                $dvbs.processTagToTagCollision(data.collision, tag);
            break;
            }

        } catch (e) {
            try{
                dv_SendErrorImp(window._dv_win.dv_config.tpsErrAddress + '/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&jsver=0&dvp_ist2tListener=1', { dvp_jsErrMsg: encodeURIComponent(e) });
            } catch (ex) { }
        }
    };

    if (window.addEventListener)
        addEventListener("message", messageEventListener, false);
    else
        attachEvent("onmessage", messageEventListener);

    this.pubSub = new function () {

        var subscribers = [];

        this.subscribe = function (eventName, uid, actionName, func) {
            if (!subscribers[eventName + uid])
                subscribers[eventName + uid] = [];
            subscribers[eventName + uid].push({ Func: func, ActionName: actionName });
        }

        this.publish = function (eventName, uid) {
            var actionsResults = [];
            if (eventName && uid && subscribers[eventName + uid] instanceof Array)
                for (var i = 0; i < subscribers[eventName + uid].length; i++) {
                    var funcObject = subscribers[eventName + uid][i];
                    if (funcObject && funcObject.Func && typeof funcObject.Func == "function" && funcObject.ActionName) {
                        var isSucceeded = runSafely(function () {
                            return funcObject.Func(uid);
                        });
                        actionsResults.push(encodeURIComponent(funcObject.ActionName) + '=' + (isSucceeded ? '1' : '0'));
                    }
                }
            return actionsResults.join('&');
        }
    };

    this.domUtilities = new function () {

        this.addImage = function (url, parentElement) {
            var image = parentElement.ownerDocument.createElement("img");
            image.width = 0;
            image.height = 0;
            image.style.display = 'none';
            image.src = appendCacheBuster(url);
            parentElement.insertBefore(image, parentElement.firstChild);
        };

        this.addScriptResource = function (url, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.src = appendCacheBuster(url);
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addScriptCode = function (srcCode, parentElement) {
            var scriptElem = parentElement.ownerDocument.createElement("script");
            scriptElem.type = 'text/javascript';
            scriptElem.innerHTML = srcCode;
            parentElement.insertBefore(scriptElem, parentElement.firstChild);
        };

        this.addHtml = function (srcHtml, parentElement) {
            var divElem = parentElement.ownerDocument.createElement("div");
            divElem.style = "display: inline";
            divElem.innerHTML = srcHtml;
            parentElement.insertBefore(divElem, parentElement.firstChild);
        }
    };

    this.resolveMacros = function(str, tag) {
        var viewabilityData = tag.getViewabilityData();
        var viewabilityBuckets = viewabilityData && viewabilityData.buckets ? viewabilityData.buckets : { };
        var upperCaseObj = objectsToUpperCase(tag, viewabilityData, viewabilityBuckets);
        var newStr = str.replace('[DV_PROTOCOL]', upperCaseObj.DV_PROTOCOL);
        newStr = newStr.replace('[PROTOCOL]', upperCaseObj.PROTOCOL);
        newStr = newStr.replace( /\[(.*?)\]/g , function(match, p1) {
            var value = upperCaseObj[p1];
            if (value === undefined || value === null)
                value = '[' + p1 + ']';
            return encodeURIComponent(value);
        });
        return newStr;
    };

    this.settings = new function () {
    };

    this.tagsType = function () { };

    this.tagsPrototype = function () {
        this.add = function (tagKey, obj) {
            if (!that.tags[tagKey])
                that.tags[tagKey] = new that.tag();
            for (var key in obj)
                that.tags[tagKey][key] = obj[key];
        }
    };

    this.tagsType.prototype = new this.tagsPrototype();
    this.tagsType.prototype.constructor = this.tags;
    this.tags = new this.tagsType();

    this.tag = function () { }
    this.tagPrototype = function () {
        this.set = function (obj) {
            for (var key in obj)
                this[key] = obj[key];
        }

        this.getViewabilityData = function () {
        }
    };

    this.tag.prototype = new this.tagPrototype();
    this.tag.prototype.constructor = this.tag;

    this.getTagObjectByService = function (serviceName) {

        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] === 'object'
                && this.tags[impressionId].services
                && this.tags[impressionId].services[serviceName]
                && !this.tags[impressionId].services[serviceName].isProcessed) {
                this.tags[impressionId].services[serviceName].isProcessed = true;
                return this.tags[impressionId];
            }
        }


        return null;
    };

    this.addService = function (impressionId, serviceName, paramsObject) {

        if (!impressionId || !serviceName)
            return;

        if (!this.tags[impressionId])
            return;
        else {
            if (!this.tags[impressionId].services)
                this.tags[impressionId].services = {};

            this.tags[impressionId].services[serviceName] = {
                params: paramsObject,
                isProcessed: false
            };
        }
    };

    this.Enums = {
        BrowserId: { Others: 0, IE: 1, Firefox: 2, Chrome: 3, Opera: 4, Safari: 5 },
        TrafficScenario: { OnPage: 1, SameDomain: 2, CrossDomain: 128 }
    };

    this.CommonData = { };
    
    var runSafely = function (action) {
        try {
            var ret = action();
            return ret !== undefined ? ret : true;
        } catch (e) { return false; }
    };

    var objectsToUpperCase = function () {
        var upperCaseObj = {};
        for (var i = 0; i < arguments.length; i++) {
            var obj = arguments[i];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    upperCaseObj[key.toUpperCase()] = obj[key];
                }
            }
        }
        return upperCaseObj;
    };

    var appendCacheBuster = function (url) {
        if (url !== undefined && url !== null && url.match("^http") == "http") {
            if (url.indexOf('?') !== -1) {
                if (url.slice(-1) == '&')
                    url += 'cbust=' + dv_GetRnd();
                else
                    url += '&cbust=' + dv_GetRnd();
            }
            else
                url += '?cbust=' + dv_GetRnd();
        }
        return url;
    };

    this.dispatchRegisteredEventsFromAllTags = function () {
        for (var impressionId in this.tags) {
            if (typeof this.tags[impressionId] !== 'function' && typeof this.tags[impressionId] !== 'undefined')
                dispatchEventCalls(impressionId, this);
        }
    };

    var dispatchEventCalls = function (impressionId, dvObj) {
        var tag = dvObj.tags[impressionId];
        var eventObj = eventsForDispatch[impressionId];
        if (typeof eventObj !== 'undefined' && eventObj != null) {
            var url = tag.protocol + '//' + tag.ServerPublicDns + "/bsevent.gif?impid=" + impressionId + '&' + createQueryStringParams(eventObj);
            dvObj.domUtilities.addImage(url, tag.tagElement.parentElement);
            eventsForDispatch[impressionId] = null;
        }
    };

    this.registerEventCall = function (impressionId, eventObject, timeoutMs) {        
        addEventCallForDispatch(impressionId, eventObject);

        if (typeof timeoutMs === 'undefined' || timeoutMs == 0 || isNaN(timeoutMs))
            dispatchEventCallsNow(this, impressionId, eventObject);
        else {
            if (timeoutMs > 2000)
                timeoutMs = 2000;

            var dvObj = this;
            setTimeout(function () {
                dispatchEventCalls(impressionId, dvObj);
                }, timeoutMs);
        }        
    };

    var dispatchEventCallsNow = function (dvObj, impressionId, eventObject) {
        addEventCallForDispatch(impressionId, eventObject);
        dispatchEventCalls(impressionId, dvObj);
    };

    var addEventCallForDispatch = function (impressionId, eventObject) {
        for (var key in eventObject) {
            if (typeof eventObject[key] !== 'function' && eventObject.hasOwnProperty(key)) {
                if (!eventsForDispatch[impressionId])
                    eventsForDispatch[impressionId] = {};
                eventsForDispatch[impressionId][key] = eventObject[key];
            }
        }
    };

    if (window.addEventListener) {
        window.addEventListener('unload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
        window.addEventListener('beforeunload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
    }
    else if (window.attachEvent) {
        window.attachEvent('onunload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
        window.attachEvent('onbeforeunload', function () { that.dispatchRegisteredEventsFromAllTags(); }, false);
    }
    else {
        window.document.body.onunload = function () { that.dispatchRegisteredEventsFromAllTags(); };
        window.document.body.onbeforeunload = function () { that.dispatchRegisteredEventsFromAllTags(); };
    }

    var createQueryStringParams = function (values) {
        var params = '';
        for (var key in values) {
            if (typeof values[key] !== 'function') {
                var value = encodeURIComponent(values[key]);
                if (params === '')
                    params += key + '=' + value;
                else
                    params += '&' + key + '=' + value;
            }
        }

        return params;
    };
}



function dv_baseHandler() {
    function J(b) {
        if (window._dv_win.document.body) return window._dv_win.document.body.insertBefore(b, window._dv_win.document.body.firstChild), !0;
        var a = 0,
            e = function() {
                if (window._dv_win.document.body) try {
                    window._dv_win.document.body.insertBefore(b, window._dv_win.document.body.firstChild)
                } catch (c) {} else a++, 150 > a && setTimeout(e, 20)
            };
        setTimeout(e, 20);
        return !1
    }

    function L(b) {
        window[b.tagObjectCallbackName] = function(a) {
            if (window._dv_win.$dvbs) {
                var e = "https" == window._dv_win.location.toString().match("^https") ?
                    "https:" : "http:";
                window._dv_win.$dvbs.tags.add(a.ImpressionID, b);
                window._dv_win.$dvbs.tags[a.ImpressionID].set({
                    tagElement: b.script,
                    impressionId: a.ImpressionID,
                    dv_protocol: b.protocol,
                    protocol: e,
                    uid: b.uid,
                    serverPublicDns: a.ServerPublicDns,
                    ServerPublicDns: a.ServerPublicDns
                })
            }
        };
        window[b.callbackName] = function(a) {
            var e = window._dv_win.dv_config.bs_renderingMethod || function(a) {
                var body = document.getElementsByTagName('body')[0];
                var script = document.createElement('script');
                script.type = 'text/javascript';
                script.innerHTML = a;
                body.appendChild(script);
            };
            switch (a.ResultID) {
                case 1:
                    b.tagPassback ? e(b.tagPassback) : a.Passback ? e(decodeURIComponent(a.Passback)) : a.AdWidth &&
                        a.AdHeight && e(decodeURIComponent("%3Cstyle%3E%0A.dvbs_container%20%7B%0A%09border%3A%201px%20solid%20%233b599e%3B%0A%09overflow%3A%20hidden%3B%0A%09filter%3A%20progid%3ADXImageTransform.Microsoft.gradient(startColorstr%3D%27%23315d8c%27%2C%20endColorstr%3D%27%2384aace%27)%3B%0A%09%2F*%20for%20IE%20*%2F%0A%09background%3A%20-webkit-gradient(linear%2C%20left%20top%2C%20left%20bottom%2C%20from(%23315d8c)%2C%20to(%2384aace))%3B%0A%09%2F*%20for%20webkit%20browsers%20*%2F%0A%09background%3A%20-moz-linear-gradient(top%2C%20%23315d8c%2C%20%2384aace)%3B%0A%09%2F*%20for%20firefox%203.6%2B%20*%2F%0A%7D%0A.dvbs_cloud%20%7B%0A%09color%3A%20%23fff%3B%0A%09position%3A%20relative%3B%0A%09font%3A%20100%25%22Times%20New%20Roman%22%2C%20Times%2C%20serif%3B%0A%09text-shadow%3A%200px%200px%2010px%20%23fff%3B%0A%09line-height%3A%200%3B%0A%7D%0A%3C%2Fstyle%3E%0A%3Cscript%20type%3D%22text%2Fjavascript%22%3E%0A%09function%0A%20%20%20%20cloud()%7B%0A%09%09var%20b1%20%3D%20%22%3Cdiv%20class%3D%5C%22dvbs_cloud%5C%22%20style%3D%5C%22font-size%3A%22%3B%0A%09%09var%20b2%3D%22px%3B%20position%3A%20absolute%3B%20top%3A%20%22%3B%0A%09%09document.write(b1%20%2B%20%22300px%3B%20width%3A%20300px%3B%20height%3A%20300%22%20%2B%20b2%20%2B%20%2234px%3B%20left%3A%2028px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%0A%09%09document.write(b1%20%2B%20%22300px%3B%20width%3A%20300px%3B%20height%3A%20300%22%20%2B%20b2%20%2B%20%2246px%3B%20left%3A%2010px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%0A%09%09document.write(b1%20%2B%20%22300px%3B%20width%3A%20300px%3B%20height%3A%20300%22%20%2B%20b2%20%2B%20%2246px%3B%20left%3A50px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%0A%09%09document.write(b1%20%2B%20%22400px%3B%20width%3A%20400px%3B%20height%3A%20400%22%20%2B%20b2%20%2B%20%2224px%3B%20left%3A20px%3B%5C%22%3E.%3C%5C%2Fdiv%3E%22)%3B%0A%20%20%20%20%7D%0A%20%20%20%20%0A%09function%20clouds()%7B%0A%20%20%20%20%20%20%20%20var%20top%20%3D%20%5B%27-80%27%2C%2780%27%2C%27240%27%2C%27400%27%5D%3B%0A%09%09var%20left%20%3D%20-10%3B%0A%20%20%20%20%20%20%20%20var%20a1%20%3D%20%22%3Cdiv%20style%3D%5C%22position%3A%20relative%3B%20top%3A%20%22%3B%0A%09%09var%20a2%20%3D%20%22px%3B%20left%3A%20%22%3B%0A%20%20%20%20%20%20%20%20var%20a3%3D%20%22px%3B%5C%22%3E%3Cscr%22%2B%22ipt%20type%3D%5C%22text%5C%2Fjavascr%22%2B%22ipt%5C%22%3Ecloud()%3B%3C%5C%2Fscr%22%2B%22ipt%3E%3C%5C%2Fdiv%3E%22%3B%0A%20%20%20%20%20%20%20%20for(i%3D0%3B%20i%20%3C%208%3B%20i%2B%2B)%20%7B%0A%09%09%09document.write(a1%2Btop%5B0%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09document.write(a1%2Btop%5B1%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09document.write(a1%2Btop%5B2%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09document.write(a1%2Btop%5B3%5D%2Ba2%2Bleft%2Ba3)%3B%0A%09%09%09if(i%3D%3D4)%0A%09%09%09%7B%0A%09%09%09%09left%20%3D-%2090%3B%0A%09%09%09%09top%20%3D%20%5B%270%27%2C%27160%27%2C%27320%27%2C%27480%27%5D%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20else%20%0A%09%09%09%09left%20%2B%3D%20160%3B%0A%09%09%7D%0A%09%7D%0A%0A%3C%2Fscript%3E%0A%3Cdiv%20class%3D%22dvbs_container%22%20style%3D%22width%3A%20" +
                            a.AdWidth + "px%3B%20height%3A%20" + a.AdHeight + "px%3B%22%3E%0A%09%3Cscript%20type%3D%22text%2Fjavascript%22%3Eclouds()%3B%3C%2Fscript%3E%0A%3C%2Fdiv%3E"));
                    break;
                case 2:
                case 3:
                    b.tagAdtag && e(b.tagAdtag);
                    break;
                case 4:
                    a.AdWidth && a.AdHeight && e(decodeURIComponent("%3Cstyle%3E%0A.dvbs_container%20%7B%0A%09border%3A%201px%20solid%20%233b599e%3B%0A%09overflow%3A%20hidden%3B%0A%09filter%3A%20progid%3ADXImageTransform.Microsoft.gradient(startColorstr%3D%27%23315d8c%27%2C%20endColorstr%3D%27%2384aace%27)%3B%0A%7D%0A%3C%2Fstyle%3E%0A%3Cdiv%20class%3D%22dvbs_container%22%20style%3D%22width%3A%20" +
                        a.AdWidth + "%3B%20height%3A%20" + a.AdHeight + "%3B%22%3E%09%0A%3C%2Fdiv%3E"))
            }
        }
    }

    function M(b) {
        var a = null,
            e = null,
            c;
        var d = b.src,
            i = dv_GetParam(d, "cmp"),
            d = dv_GetParam(d, "ctx");
        c = "919838" == d && "7951767" == i || "919839" == d && "7939985" == i || "971108" == d && "7900229" == i || "971108" == d && "7951940" == i ? "</scr'+'ipt>" : /<\/scr\+ipt>/g;
        "function" !== typeof String.prototype.trim && (String.prototype.trim = function() {
            return this.replace(/^\s+|\s+$/g, "")
        });
        var u = function(b) {
            if ((b = b.previousSibling) && "#text" == b.nodeName && (null == b.nodeValue ||
                    void 0 == b.nodeValue || 0 == b.nodeValue.trim().length)) b = b.previousSibling;
            if (b && "SCRIPT" == b.tagName && ("text/adtag" == b.getAttribute("type").toLowerCase() || "text/passback" == b.getAttribute("type").toLowerCase()) && "" != b.innerHTML.trim()) {
                if ("text/adtag" == b.getAttribute("type").toLowerCase()) return a = b.innerHTML.replace(c, "<\/script>"), {
                    isBadImp: !1,
                    hasPassback: !1,
                    tagAdTag: a,
                    tagPassback: e
                };
                if (null != e) return {
                    isBadImp: !0,
                    hasPassback: !1,
                    tagAdTag: a,
                    tagPassback: e
                };
                e = b.innerHTML.replace(c, "<\/script>");
                b = u(b);
                b.hasPassback = !0;
                return b
            }
            return {
                isBadImp: !0,
                hasPassback: !1,
                tagAdTag: a,
                tagPassback: e
            }
        };
        return u(b)
    }

    function E(b, a, e, c, d, i, u, k, r) {
        var g, m, h;
        void 0 == a.dvregion && (a.dvregion = 0);
        var v, q, F;
        try {
            h = c;
            for (m = 0; 10 > m && h != window._dv_win.top;) m++, h = h.parent;
            c.depth = m;
            g = N(c);
            v = "&aUrl=" + encodeURIComponent(g.url);
            q = "&aUrlD=" + g.depth;
            F = c.depth + d;
            i && c.depth--
        } catch (j) {
            q = v = F = c.depth = ""
        }
        d = a.script.src;
        i = "&ctx=" + (dv_GetParam(d, "ctx") || "") + "&cmp=" + (dv_GetParam(d, "cmp") || "") + "&plc=" + (dv_GetParam(d, "plc") || "") + "&sid=" + (dv_GetParam(d, "sid") ||
            "") + "&advid=" + (dv_GetParam(d, "advid") || "") + "&adsrv=" + (dv_GetParam(d, "adsrv") || "") + "&unit=" + (dv_GetParam(d, "unit") || "") + "&uid=" + a.uid + "&tagtype=" + (dv_GetParam(d, "tagtype") || "") + "&adID=" + (dv_GetParam(d, "adID") || "");
        (h = dv_GetParam(d, "xff")) && (i += "&xff=" + h);
        (h = dv_GetParam(d, "useragent")) && (i += "&useragent=" + h);
        if (void 0 != window._dv_win.$dvbs.CommonData.BrowserId && void 0 != window._dv_win.$dvbs.CommonData.BrowserVersion && void 0 != window._dv_win.$dvbs.CommonData.BrowserIdFromUserAgent) g = window._dv_win.$dvbs.CommonData.BrowserId,
            m = window._dv_win.$dvbs.CommonData.BrowserVersion, h = window._dv_win.$dvbs.CommonData.BrowserIdFromUserAgent;
        else {
            var n = h ? decodeURIComponent(h) : navigator.userAgent;
            g = [{
                id: 4,
                brRegex: "OPR|Opera",
                verRegex: "(OPR/|Version/)"
            }, {
                id: 1,
                brRegex: "MSIE|Trident/7.*rv:11|rv:11.*Trident/7",
                verRegex: "(MSIE |rv:)"
            }, {
                id: 2,
                brRegex: "Firefox",
                verRegex: "Firefox/"
            }, {
                id: 0,
                brRegex: "Mozilla.*Android.*AppleWebKit(?!.*Chrome.*)|Linux.*Android.*AppleWebKit.* Version/.*Chrome",
                verRegex: null
            }, {
                id: 0,
                brRegex: "AOL/.*AOLBuild/|AOLBuild/.*AOL/|Puffin|Maxthon|Valve|Silk|PLAYSTATION|PlayStation|Nintendo|wOSBrowser",
                verRegex: null
            }, {
                id: 3,
                brRegex: "Chrome",
                verRegex: "Chrome/"
            }, {
                id: 5,
                brRegex: "Safari|(OS |OS X )[0-9].*AppleWebKit",
                verRegex: "Version/"
            }];
            h = 0;
            m = "";
            for (var f = 0; f < g.length; f++)
                if (null != n.match(RegExp(g[f].brRegex))) {
                    h = g[f].id;
                    if (null == g[f].verRegex) break;
                    n = n.match(RegExp(g[f].verRegex + "[0-9]*"));
                    null != n && (m = n[0].match(RegExp(g[f].verRegex)), m = n[0].replace(m[0], ""));
                    break
                }
            g = f = O();
            m = f === h ? m : "";
            window._dv_win.$dvbs.CommonData.BrowserId = g;
            window._dv_win.$dvbs.CommonData.BrowserVersion = m;
            window._dv_win.$dvbs.CommonData.BrowserIdFromUserAgent =
                h
        }
        i += "&brid=" + g + "&brver=" + m + "&bridua=" + h;
        (h = dv_GetParam(d, "turl")) && (i += "&turl=" + h);
        (h = dv_GetParam(d, "tagformat")) && (i += "&tagformat=" + h);
        var A;
        h = function() {
            try {
                return !!window.sessionStorage
            } catch (a) {
                return !0
            }
        };
        m = function() {
            try {
                return !!window.localStorage
            } catch (a) {
                return !0
            }
        };
        g = function() {
            var a = document.createElement("canvas");
            if (a.getContext && a.getContext("2d")) {
                var b = a.getContext("2d");
                b.textBaseline = "top";
                b.font = "14px 'Arial'";
                b.textBaseline = "alphabetic";
                b.fillStyle = "#f60";
                b.fillRect(0, 0, 62, 20);
                b.fillStyle = "#069";
                b.fillText("!image!", 2, 15);
                b.fillStyle = "rgba(102, 204, 0, 0.7)";
                b.fillText("!image!", 4, 17);
                return a.toDataURL()
            }
            return null
        };
        try {
            f = [];
            f.push(["lang", navigator.language || navigator.browserLanguage]);
            f.push(["tz", (new Date).getTimezoneOffset()]);
            f.push(["hss", h() ? "1" : "0"]);
            f.push(["hls", m() ? "1" : "0"]);
            f.push(["odb", typeof window.openDatabase || ""]);
            f.push(["cpu", navigator.cpuClass || ""]);
            f.push(["pf", navigator.platform || ""]);
            f.push(["dnt", navigator.doNotTrack || ""]);
            f.push(["canv", g()]);
            var p = f.join("=!!!=");
            if (null == p || "" == p) A = "";
            else {
                h = function(a) {
                    for (var b = "", d, c = 7; 0 <= c; c--) d = a >>> 4 * c & 15, b += d.toString(16);
                    return b
                };
                m = [1518500249, 1859775393, 2400959708, 3395469782];
                var p = p + String.fromCharCode(128),
                    y = Math.ceil((p.length / 4 + 2) / 16),
                    z = Array(y);
                for (g = 0; g < y; g++) {
                    z[g] = Array(16);
                    for (f = 0; 16 > f; f++) z[g][f] = p.charCodeAt(64 * g + 4 * f) << 24 | p.charCodeAt(64 * g + 4 * f + 1) << 16 | p.charCodeAt(64 * g + 4 * f + 2) << 8 | p.charCodeAt(64 * g + 4 * f + 3)
                }
                z[y - 1][14] = 8 * (p.length - 1) / Math.pow(2, 32);
                z[y - 1][14] = Math.floor(z[y - 1][14]);
                z[y -
                    1][15] = 8 * (p.length - 1) & 4294967295;
                var p = 1732584193,
                    f = 4023233417,
                    n = 2562383102,
                    G = 271733878,
                    H = 3285377520,
                    s = Array(80),
                    B, t, w, x, I;
                for (g = 0; g < y; g++) {
                    for (var l = 0; 16 > l; l++) s[l] = z[g][l];
                    for (l = 16; 80 > l; l++) s[l] = (s[l - 3] ^ s[l - 8] ^ s[l - 14] ^ s[l - 16]) << 1 | (s[l - 3] ^ s[l - 8] ^ s[l - 14] ^ s[l - 16]) >>> 31;
                    B = p;
                    t = f;
                    w = n;
                    x = G;
                    I = H;
                    for (l = 0; 80 > l; l++) {
                        var D = Math.floor(l / 20),
                            E = B << 5 | B >>> 27,
                            C;
                        c: {
                            switch (D) {
                                case 0:
                                    C = t & w ^ ~t & x;
                                    break c;
                                case 1:
                                    C = t ^ w ^ x;
                                    break c;
                                case 2:
                                    C = t & w ^ t & x ^ w & x;
                                    break c;
                                case 3:
                                    C = t ^ w ^ x;
                                    break c
                            }
                            C = void 0
                        }
                        var J = E + C + I + m[D] + s[l] & 4294967295;
                        I = x;
                        x = w;
                        w = t << 30 | t >>> 2;
                        t = B;
                        B = J
                    }
                    p = p + B & 4294967295;
                    f = f + t & 4294967295;
                    n = n + w & 4294967295;
                    G = G + x & 4294967295;
                    H = H + I & 4294967295
                }
                A = h(p) + h(f) + h(n) + h(G) + h(H)
            }
        } catch (L) {
            A = null
        }
        a = (window._dv_win.dv_config.verifyJSURL || a.protocol + "//" + (window._dv_win.dv_config.bsAddress || "rtb" + a.dvregion + ".doubleverify.com") + "/verify.js") + "?jsCallback=" + a.callbackName + "&jsTagObjCallback=" + a.tagObjectCallbackName + "&num=6" + i + "&srcurlD=" + c.depth + "&ssl=" + a.ssl + "&refD=" + F + a.tagIntegrityFlag + a.tagHasPassbackFlag + "&htmlmsging=" + (u ? "1" : "0") +
            (null != A ? "&aadid=" + A : "");
        (c = dv_GetDynamicParams(d).join("&")) && (a += "&" + c);
        if (!1 === k || r) a = a + ("&dvp_isBodyExistOnLoad=" + (k ? "1" : "0")) + ("&dvp_isOnHead=" + (r ? "1" : "0"));
        e = "srcurl=" + encodeURIComponent(e);
        if ((k = window._dv_win[K("=@42E:@?")][K("2?46DE@C~C:8:?D")]) && 0 < k.length) {
            r = [];
            r[0] = window._dv_win.location.protocol + "//" + window._dv_win.location.hostname;
            for (c = 0; c < k.length; c++) r[c + 1] = k[c];
            k = r.reverse().join(",")
        } else k = null;
        k && (e += "&ancChain=" + encodeURIComponent(k));
        k = 4E3;
        /MSIE (\d+\.\d+);/.test(navigator.userAgent) &&
            7 >= new Number(RegExp.$1) && (k = 2E3);
        if (d = dv_GetParam(d, "referrer")) d = "&referrer=" + d, a.length + d.length <= k && (a += d);
        v.length + q.length + a.length <= k && (a += q, e += v);
        return a += "&eparams=" + encodeURIComponent(K(e)) + "&" + b.getVersionParamName() + "=" + b.getVersion()
    }

    function N(b) {
        try {
            if (1 >= b.depth) return {
                url: "",
                depth: ""
            };
            var a, e = [];
            e.push({
                win: window._dv_win.top,
                depth: 0
            });
            for (var c, d = 1, i = 0; 0 < d && 100 > i;) {
                try {
                    if (i++, c = e.shift(), d--, 0 < c.win.location.toString().length && c.win != b) return 0 == c.win.document.referrer.length ||
                        0 == c.depth ? {
                            url: c.win.location,
                            depth: c.depth
                        } : {
                            url: c.win.document.referrer,
                            depth: c.depth - 1
                        }
                } catch (u) {}
                a = c.win.frames.length;
                for (var k = 0; k < a; k++) e.push({
                    win: c.win.frames[k],
                    depth: c.depth + 1
                }), d++
            }
            return {
                url: "",
                depth: ""
            }
        } catch (r) {
            return {
                url: "",
                depth: ""
            }
        }
    }

    function K(b) {
        new String;
        var a = new String,
            e, c, d;
        for (e = 0; e < b.length; e++) d = b.charAt(e), c = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".indexOf(d), 0 <= c && (d = "!\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~".charAt((c +
            47) % 94)), a += d;
        return a
    }

    function D() {
        return Math.floor(1E12 * (Math.random() + ""))
    }

    function O() {
        try {
            if ("function" === typeof window.callPhantom) return 99;
            try {
                if ("function" === typeof window.top.callPhantom) return 99
            } catch (b) {}
            if (void 0 != window.opera && void 0 != window.history.navigationMode || void 0 != window.opr && void 0 != window.opr.addons && "function" == typeof window.opr.addons.installExtension) return 4;
            if (void 0 != window.chrome && "function" == typeof window.chrome.csi && "function" == typeof window.chrome.loadTimes && void 0 !=
                document.webkitHidden && (!0 == document.webkitHidden || !1 == document.webkitHidden)) return 3;
            if (void 0 != window.mozInnerScreenY && "number" == typeof window.mozInnerScreenY && void 0 != window.mozPaintCount && 0 <= window.mozPaintCount && void 0 != window.InstallTrigger && void 0 != window.InstallTrigger.install) return 2;
            if (void 0 != document.uniqueID && "string" == typeof document.uniqueID && (void 0 != document.documentMode && 0 <= document.documentMode || void 0 != document.all && "object" == typeof document.all || void 0 != window.ActiveXObject &&
                    "function" == typeof window.ActiveXObject)) return 1;
            var a = !1;
            try {
                var e = document.createElement("p");
                e.innerText = ".";
                e.style = "text-shadow: rgb(99, 116, 171) 20px -12px 2px";
                a = void 0 != e.style.textShadow
            } catch (c) {}
            return 0 < Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") && a && void 0 != window.innerWidth && void 0 != window.innerHeight ? 5 : 0
        } catch (d) {
            return 0
        }
    }
    this.createRequest = function() {
        var b = !1,
            a = window._dv_win,
            e = 0,
            c = !1;
        try {
            for (dv_i = 0; 10 >= dv_i; dv_i++)
                if (null != a.parent && a.parent != a)
                    if (0 <
                        a.parent.location.toString().length) a = a.parent, e++, b = !0;
                    else {
                        b = !1;
                        break
                    } else {
                0 == dv_i && (b = !0);
                break
            }
        } catch (d) {
            b = !1
        }
        0 == a.document.referrer.length ? b = a.location : b ? b = a.location : (b = a.document.referrer, c = !0);
        window._dv_win._dvScripts || (window._dv_win._dvScripts = []);
        var i = document.getElementsByTagName("script");
        for (dv_i in i)
            if (i[dv_i].src) {
                var u = i[dv_i].src,
                    k = window._dv_win.dv_config.bs_regex || /^[ \t]*(http(s)?:\/\/)?embed\.reelfeed\.tv\/js\/vpaid\/dvbs_src\.js/;
                if (u && u.match(k) && !dv_Contains(window._dv_win._dvScripts,
                        i[dv_i])) {
                    this.dv_script = i[dv_i];
                    window._dv_win._dvScripts.push(i[dv_i]);
                    var r;
                    r = window._dv_win.dv_config ? window._dv_win.dv_config.bst2tid ? window._dv_win.dv_config.bst2tid : window._dv_win.dv_config.dv_GetRnd ? window._dv_win.dv_config.dv_GetRnd() : D() : D();
                    var g, k = window.parent.postMessage && window.JSON,
                        m = !0,
                        h = !1;
                    if ("0" == dv_GetParam(u, "t2te") || window._dv_win.dv_config && !0 == window._dv_win.dv_config.supressT2T) h = !0;
                    if (k && !1 == h) try {
                        var v = window._dv_win.dv_config.bst2turl || "https://cdn3.doubleverify.com/bst2tv3.html",
                            h = "bst2t_" + r,
                            q = void 0;
                        if (document.createElement && (q = document.createElement("iframe"))) q.name = q.id = window._dv_win.dv_config.emptyIframeID || "iframe_" + D(), q.width = 0, q.height = 0, q.id = h, q.style.display = "none", q.src = v;
                        g = q;
                        m = J(g)
                    } catch (F) {}
                    var j;
                    g = u;
                    v = {};
                    try {
                        for (var n = RegExp("[\\?&]([^&]*)=([^&#]*)", "gi"), f = n.exec(g); null != f;) "eparams" !== f[1] && (v[f[1]] = f[2]), f = n.exec(g);
                        j = v
                    } catch (A) {
                        j = v
                    }
                    j.uid = r;
                    j.script = this.dv_script;
                    j.callbackName = "__verify_callback_" + j.uid;
                    j.tagObjectCallbackName = "__tagObject_callback_" +
                        j.uid;
                    j.tagAdtag = null;
                    j.tagPassback = null;
                    j.tagIntegrityFlag = "";
                    j.tagHasPassbackFlag = "";
                    !1 == (null != j.tagformat && "2" == j.tagformat) && (n = M(j.script), j.tagAdtag = n.tagAdTag, j.tagPassback = n.tagPassback, n.isBadImp ? j.tagIntegrityFlag = "&isbadimp=1" : n.hasPassback && (j.tagHasPassbackFlag = "&tagpb=1"));
                    j.protocol = "http:";
                    j.ssl = "0";
                    "https" == j.script.src.match("^https") && "https" == window._dv_win.location.toString().match("^https") && (j.protocol = "https:", j.ssl = "1");
                    L(j);
                    return E(this, j, b, a, e, c, k, m, i[dv_i] && i[dv_i].parentElement &&
                        i[dv_i].parentElement.tagName && "HEAD" === i[dv_i].parentElement.tagName)
                }
            }
    };
    this.sendRequest = function(b) {
        var a = dv_GetParam(b, "tagformat");
        a && "2" == a ? $dvbs.domUtilities.addScriptResource(b, document.body) : dv_sendScriptRequest(b);
        return !0
    };
    this.isApplicable = function() {
        return !0
    };
    this.onFailure = function() {
        var b = window._dv_win._dvScripts,
            a = this.dv_script;
        null != b && (void 0 != b && a) && (a = b.indexOf(a), -1 != a && b.splice(a, 1))
    };
    window.debugScript && (window.CreateUrl = E);
    this.getVersionParamName = function() {
        return "ver"
    };
    this.getVersion = function() {
        return "21"
    }
};


function dvbs_src_main(dvbs_baseHandlerIns, dvbs_handlersDefs) {

    this.bs_baseHandlerIns = dvbs_baseHandlerIns;
    this.bs_handlersDefs = dvbs_handlersDefs;

    this.exec = function() {
        try {
            window._dv_win = (window._dv_win || window);
            window._dv_win.$dvbs = (window._dv_win.$dvbs || new dvBsType());

            window._dv_win.dv_config = window._dv_win.dv_config || { };
            window._dv_win.dv_config.bsErrAddress = window._dv_win.dv_config.bsAddress || 'rtb0.doubleverify.com';

            var errorsArr = (new dv_rolloutManager(this.bs_handlersDefs, this.bs_baseHandlerIns)).handle();
            if (errorsArr && errorsArr.length > 0)
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verify.js?ctx=818052&cmp=1619415&num=6', errorsArr);
        }
        catch(e) {
            try {
                dv_SendErrorImp(window._dv_win.dv_config.bsErrAddress + '/verify.js?ctx=818052&cmp=1619415&num=6&dvp_isLostImp=1', { dvp_jsErrMsg: encodeURIComponent(e) });
            } catch(e) { }
        }
    };
};

try {
    window._dv_win = window._dv_win || window;
    var dv_baseHandlerIns = new dv_baseHandler();
    

    var dv_handlersDefs = [];
    (new dvbs_src_main(dv_baseHandlerIns, dv_handlersDefs)).exec();
} catch (e) { }