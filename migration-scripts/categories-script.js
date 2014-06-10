var fs = require('fs'),
    file = __dirname + '/jsonfiles/annotations.json',
    simpledb = require('mongoose-simpledb');

// Initialize simpledb.
simpledb.init({ connectionString: 'mongodb://localhost/sas' }, function (err, db) {
    if (err) return console.error(err);
    
    var categories = [
        {
            name: 'Absurdity',
            description: "Sometimes, I admit, I get a bit carried away with this. When Paul, for example, talked about \"<a href=\"philem/1.html#20\">refreshing his bowels in the Lord</a>\" in his <a href=\"philem/1.html\">letter to Philemon</a>, he probably didn't mean it the way it sounds in the King James Version. But I mark it anyway, because I like the way it sounds."
        },
        {
            name: 'Injustice',
            description: "Bible believers like to claim that we all get our morality and sense of justice from the Bible. But we don’t. None of us do. No one believes that it is just to punish children for what their parents did, that parents should be willing to kill their children for God, or that children should be executed for disobeying their parents, to name just a few examples. And yet these are considered moral imperatives in the Bible. In the SAB, I highlight the verses that make us all cringe today, and make us all glad that we don’t actually get our morals and sense of justice from the Bible."
        },
        {
            name: 'Cruelty and Violence',
            description: "It's not the cruelty and violence per se that bothers me; it's the biblical god's role in the cruel and violent acts. The God of the Bible ordered Saul to kill \"man and woman, infant and suckling, ox and sheep, camel and ass\" in <a href=\"1sam/15.html#2\">1 Samuel 15.2-3</a>. And the Bible contains hundreds of other cruel acts of God, any one of which, if true, would be enough for me to reject the Bible and its vicious God."
        },
        {
            name: 'Intolerance',
            description: "If there's a point to the Bible and to religion in general it is this: God likes some people and religious beliefs more than others. In the Hebrew scriptures, the Jews are his favorite people, and he despises everyone else. Even so, he only likes certain Jews. Witches, homosexuals, disobedient children, Sabaath breakers, and people with different religious beliefs are to be executed. And it's even worse in the New Testament. People with the \"wrong\" religious beliefs are not just killed; they are tortured forever after they die for their supposedly mistaken beliefs."
        },
        {
            name: 'Good Stuff',
            description: "But isn't there some good stuff in the Bible? Well yes there is, although surprisingly little for such a big book. Indeed, if the bad, boring, and useless passages were removed from the Bible and only the good retained, the Bible would be nothing more than a small pamphlet. But Bible-believers are unwilling to edit the Bible. So the good verses, when not invalidated by their immediate context, are contradicted elsewhere in the Bible. There is not a single good idea in the entire Bible that is taught consistently throughout. Consequently, it is worse than useless as a moral, philosophical, political, or scientific guide. Still, I think it's important to point out the good stuff in the Bible, and so I have highlighted the good verses and provided a \"thumbs up\" icon to mark them in the text."
        },
        {
            name: 'Contradictions',
            description: "Contradictions seem to be the only things that believers are concerned about. God can tell Jehu to collect 70 heads in two baskets, and believers are okay with that, since the Bible is consistent on that topic. But <a href=\"http://skepticsannotatedbible.com/contra/moab.html\">did God kill 23,000 or 24,000</a> for committing whoredom with the daughters of Moab? Now <i>that</i>'s a real problem to a believer. Not that God would kill so many people for so silly a reason. Who cares about that? No, it's the number that's important, because the Bible must not disagree with itself."
        },
        {
            name: 'Science and History',
            description: "Religious moderates and secular accomodationists claim that there is no conflict between science and religion. And although that might be true of some religions (Buddhism and deism perhaps), it is not true for any that are based upon the Bible. Because the Bible makes many statements about science and history that we now know are false. Biblical fundamentalists know there is a conflict between science and religion. They solve this conflict by rejecting science whenever it conflicts with the Bible, which it does whenever the Bible says anything about science or history."
        },
        {
            name: 'Family Values',
            description: "The religious right loves to talk about biblical family values. So I’ve included this category to show just what those values entail. <a href=\"dt/13.html#6\">When should you stone to death your whole family?</a> <a href=\"dt/22.html#13\">What should be done with a non-virgin bride on her wedding night?</a> <a href=\"lk/14.html#26\">What did Jesus have to say about hating our families?</a> It’s all highlighted in the SAB."
        },
        {
            name: 'Interpretation',
            description: "Mark Twain said, \"It ain't the parts of the Bible that I can't understand that bother me, it is the parts that I do understand.\" And he was right about that. Most of the Bible is clear enough to anyone who takes the time to read it. And yet it’s surprising how many passages, whose meaning seems clear enough to a nonbeliever, are interpreted completely differently by the various groups of believers."
        },
        {
            name: 'Misogyny',
            description: "The Bible has plenty to say about women, and nearly all of it is insulting. <a href=\"dt/25.html#11\">When should you cut off a woman's hand, without pity?</a> <a href=\"1tim/2.html#11\">When may a woman teach or speak in church?</a> <a href=\"dt/24.html#1\">What should you do with a wife that no longer pleases you?</a>, <a href=\"num/5.html#11\">How to find out if your wife has been unfaithful?</a> <a href=\"lev/15.html#19\">What to do with a menstruating woman?</a> <a href=\"1tim/2.html#15\">How are women saved?</a> It's all there in all of its misogynistic glory."
        },
        {
            name: 'Sex',
            description: "I don’t want to give you the wrong impression here. I have nothing against sex. It is included as a highlighted category for the following reason: Bible-believers often complain about sex in library books, television, movies, and art museums. These complaints, when successful, result in censorship. Christians should realize, however, that if any book is removed from the library because of its sexual content, then the Bible should also be removed."
        },
        {
            name: 'Prophecy',
            description: "The authors of the New Testament searched the Hebrew Scriptures to find passages that they could claim were prophecies about Jesus. Pretty much anything would do. But when a passage didn't quite fit (and none of them did), they had two options: alter the scripture to fit the story about Jesus, or alter the story about Jesus to fit the scripture. Believers still justify their belief by pointing to the passages from the Hebrew Scriptures that supposedly point to Jesus. And I highlight such passages and point out which of the two options they use."
        },
        {
            name: 'Language',
            description: "According to <a href=\"pr/30.html#5\">Proverbs 30.5</a>, \"Every word of God is pure.\" If so, then there's a lot in the Bible that isn't the word of God. Try reading <a href=\"2kg/18.html#27\">2 Kings 18.27</a>, <a href=\"ezek/23.html#20\">Ezekiel 23.20</a>, or <a href=\"mal/2.html#3\">Malachi 2.3</a>, for example."
        },
        {
            name: 'Boring Stuff',
            description: ""
        },
        {
            name: 'Politics',
            description: "Since it's an election year (2012), I thought I'd start a new SAB category: Politics. Here's the first verse, <a href=\"http://www.rightwingwatch.org/content/james-inhofe-says-bible-refutes-climate-change\">used by Senator James Inhofe</a> to prove that human-caused climate change does not exist. <blockquote>While the earth remaineth, seedtime and harvest, and cold and heat, and summer and winter, and day and night shall not cease. <a href=\"gen/8.html#22\">Genesis 8:22</a></blockquote> I'll be adding more verses as I come across them, so you'll start to see them now and then in the SAB."
        },
        {
            name: 'Homosexuality',
            description: "Considering the amount of attention this gets from the religious right, you’d think the Bible had a lot to say about homosexuality. It doesn’t. There are fewer passages in this category than in any other in the SAB. Still, contrary to the religious left, the Bible, in the few verses that address it, is clear enough about it: homosexuality is an abomination, and the punishment for it is death."
        }
    ];

    categories.forEach(function (item) {
        var category = new db.Category({
            name: item.name,
            icon: item.name.toLowerCase().replace(/ /g, '-'),
            description: item.description
        });
        category.save();
    });

}); // Initialize simpledb.
