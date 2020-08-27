export default {

     timeDiff : function (postedTime) {

        const postedDateInfo = postedTime.split(/-|,/)
        // const postedDateInfo = postedTime.split('-')
        const postedTimeInfo = postedDateInfo[2].split('T')
        const postedClock    = postedTimeInfo[1].split('Z')
        const clock          = (postedClock+'').split(':')

        const year1           = parseInt(postedDateInfo[0])
        const month1          = parseInt(postedDateInfo[1])
        const day1            = parseInt(postedTimeInfo[0])
        const hour1           = parseInt(clock[0])
        const minute1         = parseInt(clock[1])
        const second1         = parseInt((clock[2].split('.'))[0])

        const today = new Date()
        const year2           = parseInt(today.getFullYear())
        const month2          = parseInt((today.getMonth()+1))
        const day2            = parseInt(today.getDate())
        const hour2           = parseInt(today.getHours())
        const minute2         = parseInt(today.getMinutes())
        const second2         = parseInt(today.getSeconds())


        const monthList = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER']

        const isLeap = (yy) => {
        return (yy%4 === 0 && yy%100!==0) || (yy%400 === 0)
        } 

        const secs = (y, mo, d, h, mi, s) => {
        let sd= 0
        if (mo<2){
            for (let i=1; i<d; i++){
            sd+=1
            }
            return sd*86400+h*3600+mi*60+s
        }

        let days =0 
        for (let i=1 ; i<mo ; i++){
            if (i===4 || i===6 || i===9 || i===11){
            days+=30
            } else 
            if (i === 2){
                days+= isLeap(y)? 29: 28
            } else days+=31
        } 

        return (days+d-1)*86400 +h*3600+mi*60+s 

        }

        const dif = (y1,mo1,d1,h1,mi1,s1, y2,mo2,d2,h2,mi2,s2) =>{
            // console.log(y1,mo1,d1,h1,mi1,s1)
            // console.log(y2,mo2,d2,h2,mi2,s2)
        const secs1 = secs(y1,mo1,d1,h1,mi1,s1) + 7*3600
        const secs2 = secs(y2,mo2,d2,h2,mi2,s2)


        let gap=0

        if((y2 === y1) || y2 === y1+1 ){
            gap = 0
            
        } else 
        for(let i=y1+1; i<y2; i++){
            if (isLeap(i)){
            gap+=366
            }
            gap+=365
        }

        const D = isLeap(y1)?(31622400-secs1):(31536000-secs1)

        return (y2!==y1)?(D + gap*86400 + secs2): secs2-secs1

        }
        




        const disp = (del, year2, year1, month1, day1) => {

        if ( del <60){
            return `${del} SECONDS AGO`
        }
        if (del>59 && del< 3600){
            return `${Math.trunc(del/60)} MINUTES AGO`
        }

        if (del>3599 && del< 86400 ){
            return `${Math.trunc(del/3600)} HOURS AGO `
        }

        if(del>86399 && del<604800){
            return `${Math.trunc(del/86400)} DAYS AGO`
        }

        if(del>604799){
            if (year2 === year1){
                return `${monthList[month1-1]} ${day1}`
            }
            return `${monthList[month1-1]} ${day1}, ${year1}`
        }
        }



        return disp(dif(year1,month1,day1,hour1,minute1,second1,   year2,month2,day2,hour2, minute2 ,second2),year2, year1, month1, day1)

    }  



}