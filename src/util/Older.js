export default {
    Older: function(str){
        let d = str.split('-')

        let e =d[2].split('T')

        let f =e[1].split('Z')

        let g =f[0].split(':')

        return parseInt(d[0]+d[1]+e[0]+g[0]+g[1]+g[2]) 

    }
}