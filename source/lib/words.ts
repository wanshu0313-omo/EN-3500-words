export type Word = {id:number;word:string;pos:string;meaning:string;related:string;phrase:string};
const rows = `being|n.|存在；生物|existence|a human being
government|n.|政府；治理|the authorities|local government
found|v.|建立；创办|establish|found a company
given|prep.|考虑到；鉴于|considering|given the circumstances
state|v.|陈述；说明|assert|state a reason
council|n.|地方议会；委员会|local authority|the city council
available|adj.|可获得的；可使用的|accessible|available resources
saw|n.|锯子|cutting tool|a hand saw
means|n.|手段；方法|method|a means of transport
likely|adj.|可能的|probable|be likely to happen
therefore|adv.|因此；所以|as a result|therefore necessary
evidence|n.|证据|proof|scientific evidence
range|n.|范围；领域|scope|a wide range of
thus|adv.|因此；如此|thereby|thus reducing costs
individual|adj.|个别的；个人的|separate|individual needs
committee|n.|委员会|panel|a research committee
indeed|adv.|确实；实际上|really|very useful indeed
authority|n.|权力；权威；当局|power|local authority
union|n.|工会；联合组织|association|a trade union
figure|n.|数字；人物|number|a historical figure
practice|n.|惯例；实践|custom|common practice
former|adj.|以前的；前者的|previous|a former teacher
issue|n.|问题；争议点|matter|an environmental issue
stage|n.|阶段；舞台|phase|at an early stage
various|adj.|各种各样的|different|various reasons
basis|n.|基础；根据|foundation|on a regular basis
despite|prep.|尽管|in spite of|despite the difficulty
structure|n.|结构；构造|framework|the structure of society
capital|n.|首都；资本|the seat of government|the capital city
per|prep.|每；每一|for each|per person
agreement|n.|协议；一致意见|consensus|reach an agreement
population|n.|人口|residents|population growth
legal|adj.|法律的；合法的|legitimate|legal advice
fine|n.|罚款|penalty|pay a fine
theory|n.|理论；学说|hypothesis|in theory
growth|n.|增长；发展|development|economic growth
relationship|n.|关系；联系|connection|a close relationship
property|n.|财产；特性|estate|private property
term|n.|术语；用语|word|a technical term
throughout|prep.|遍及；贯穿|all over|throughout the year
previous|adj.|以前的；先前的|prior|previous experience
firm|n.|公司；企业|company|a law firm
significant|adj.|重要的；显著的|important|a significant change
income|n.|收入|earnings|annual income
contract|n.|合同；契约|agreement|sign a contract
consider|v.|考虑；认为|regard|consider the options
attempt|v.|尝试|try|attempt to solve
specific|adj.|特定的；明确的|particular|a specific example
claim|v.|声称；主张|assert|claim that something is true
leading|adj.|主要的；领先的|chief|a leading expert
potential|n.|潜力；可能性|capacity|reach your potential
demand|v.|要求|insist|demand an explanation
unless|conj.|除非|if … not|unless otherwise stated
access|n.|使用权；接近的机会|permission|access to education
independent|adj.|独立的|autonomous|independent research
benefit|n.|好处；利益；津贴|advantage|health benefits
employment|n.|就业；雇用|work|employment opportunities
sales|n.|销售额；销售部门|revenue|sales figures
influence|n.|影响；作用|effect|a positive influence
concern|v.|涉及；使担忧|be related to|issues that concern us
application|n.|申请；应用|request|a job application
suppose|v.|认为；推测|assume|suppose that this is true
immediately|adv.|立即；马上|instantly|respond immediately
opportunity|n.|机会|chance|an opportunity to learn
film|n.|电影；薄膜|movie|a documentary film
trust|n.|信任；信赖|faith|build trust
effective|adj.|有效的|efficient|an effective solution
region|n.|地区；区域|area|a coastal region
degree|n.|程度|level|to some degree
traditional|adj.|传统的；惯例的|conventional|traditional methods
election|n.|选举|poll|a general election
parliament|n.|议会；国会|legislature|a member of parliament
review|n.|审查；评论|examination|a literature review
species|n.|物种|kind|an endangered species
supply|v.|供应；提供|provide|supply clean water
moving|adj.|感人的|touching|a moving story
considerable|adj.|相当大的；可观的|substantial|considerable progress
physical|adj.|身体的；物质的|bodily|physical activity
complex|adj.|复杂的|complicated|a complex problem
responsibility|n.|责任；职责|duty|take responsibility for`;
export const words:Word[]=rows.split('\n').map((r,i)=>{const [word,pos,meaning,related,phrase]=r.split('|');return {id:i+1,word,pos,meaning,related,phrase}});
export const tracks=[{id:'0001-0040',label:'基础词 0001—0040',from:1,to:40},{id:'0041-0080',label:'基础词 0041—0080',from:41,to:80}];
