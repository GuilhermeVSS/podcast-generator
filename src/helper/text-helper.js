
class TextHelper {

    titleNormalize(title){
        return title.replace(/[\u0300-\u036f]/g, '').replace(/[^\w\s]/gi, '').toLowerCase().split(' ').join('-');
    }
    removeBrackets(text){
        const byOpenings = text.replace('“', '').replace('”', '').split('<');
        return byOpenings.map(data=>data.slice(data.indexOf('>')+1)).join('');
    }

    

    stringifyText(SectionArray){
        return SectionArray.map(data=>{
            const object = {
                title: this.removeBrackets(data.title),
                subtitle: this.removeBrackets(data.subtitle),
                subtopic: this.removeBrackets(data.subtopic),
                paragraph: data.paragraph.map(pg=>this.removeBrackets(pg))
            }
            return object;
        })
    }

    unifyText(SectionArray){
        const Text = SectionArray.map((data)=>{
            const paragraph = data.paragraph.join();
            const title = data.title;
            const subtitle = data.subtitle;
            const subtopic = data.subtopic;
            return title + ' '+ subtitle +' '+ subtopic + ' '  + paragraph + ' ';
        });
        const formatedText = [];
        let currentStrign = ''
        for(const section of Text){
            if ((currentStrign + section).length < 3000){
                currentStrign+= section;
            }
            else {
                formatedText.push(currentStrign);
                currentStrign = section;
            }
        }
        return formatedText;
    }
}

module.exports = new TextHelper();