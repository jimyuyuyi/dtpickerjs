/**Lightweight Date Time picker popup;  
* V1.0 @2015-04-07 by jimyuyuyi@gmail.com
*
* Redistributions of this source code must retain this copyright
* notice and the following disclaimer.
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
* You should have received a copy of the GNU General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
* Commercial use may be granted to the extent that this source code
* does NOT become part of any other Open Source or Commercially licensed
* development library or toolkit without explicit permission.
*/
var DTpicker=function(pari,opts)
{	var t_=this,ud,nan=Number.NaN;	
	var defopts={'monthselector':ud,'weekstartday':0,'wkheadlen':2,'hidetimeout':500,		
		'valformatfunc':ud,'submitendfunc':ud,'ymformatfunc':ud,
		'locale':ud,'starttime':nan,'endtime':nan,'html5dateinputignore':true,keybind:true,
		'timeinput':ud,'timeinputmax':{'Hours':24,'Minutes':60},
		'csstxt':'.cal_maindiv{position:absolute;border:1px solid black;background-color:white;}'+
			'.cal_head,.cal_cell,.cal_monthbtn,.cal_monthlbl'+
			'{display:inline-block;text-align:center;}'+
			'.cal_head,.cal_monthbtn,.cal_monthlbl{font-weight:bold;}'+
			'.cal_head,.cal_cell,.cal_monthbtn{width:24px;overflow:hidden;}'+
			'.cal_monthlbl{width:72px;}'+
			'.cal_timeinput{width:24px;}'+
			'.cal_timebtn{cursor:pointer;}'+
			'.cal_disable{color:#CCCCCC;}'+
			'.cal_wkend{color:purple}'+
			'.cal_sel{color:red;border:1px solid red;}'
	};var genvars={'timeval':ud,'ymDT':ud,'inittime':ud,'dtime':ud,'par':ud,'partop':ud,'maindiv':ud,'wkrow':ud,'cellrows':[],'hidetimer':ud,'keyct':ud};
	for(var k in defopts)
	{	if(opts&& opts[k]!=ud)
		{	t_[k]=opts[k];
		}else
		{	t_[k]=defopts[k];
		}
	}for(var k in genvars){t_[k]=genvars[k];}	
	if((typeof(pari)).match(/^str/i))
	{	var parn=document.getElementById(pari);
		if(!parn)
		{	parn=document.getElementByName(pari);
			if(parn&& parn.length>0){parn=parn[0];}
		}pari=parn;
	}if(!pari||!pari.tagName){pari=document.body;}
	t_.par=pari;
	var dtptmp=DTpicker.getdateinput();
	if(dtptmp&& !t_.html5dateinputignore)
	{	if(t_.par.tagName.match(/input/i))
		{	if(t_.par.type!='date')
			{	t_.par.type='date';
			}
		}else
		{	t_.par.appendChild(dtptmp);
		}return dtptmp;
	}t_.partop=t_.par;
	if(!t_.par.tagName.match(/body/i)&& t_.par.parentNode)
	{	t_.partop=t_.par.parentNode;
	}t_.cssheadset();
	t_.calinit();
	t_.calcells();	
	t_.hide();
	DTpicker.evtadd(t_.par,'focus',function(e){t_.show(e);});
	if(!t_.keybind)
	{	DTpicker.evtadd(t_.par,'blur',function(e){t_.hidedelay(e);});
	}DTpicker.evtadd(t_.maindiv,'focus',function(e){t_.hidecancel();});
	DTpicker.evtadd(t_.maindiv,'mouseover',function(e){t_.hidecancel();});
	DTpicker.evtadd(t_.maindiv,'mouseenter',function(e){t_.hidecancel();})	
};
DTpicker.prototype.cssheadset=function(cssid)
{	var t_=this;
	if(!cssid){cssid='DTPickercss';}
	if(!t_.cssnode)
	{	t_.cssnode=document.getElementById(cssid);
	}if(!t_.cssnode)
	{	t_.cssnode=document.createElement('style');
		t_.cssnode.id=cssid;
		t_.cssnode.type='text/css'; t_.cssnode.rel='stylesheet';
		var par=document.getElementsByTagName('head');
		if(par&& par.length>0){par=par[0];}else{par=t_.partop;}
		par.appendChild(t_.cssnode);
	}if(t_.cssnode.styleSheet)
	{	t_.cssnode.styleSheet.cssText=t_.csstxt;
	}else
	{	t_.cssnode.innerHTML=t_.csstxt;
	}
};
DTpicker.prototype.show=function(e)
{	var t_=this;
	if(e){DTpicker.evtcancel(e);}
	with(t_.maindiv.style)
	{	display='block';
		left=t_.par.offsetLeft+'px';
		top=(t_.par.offsetTop+t_.par.offsetHeight)+'px';		
	}
	if(t_.keybind&& t_.keyct)
	{	t_.keyct.focus();
		t_.par.readOnly=true;
	}
};
DTpicker.prototype.hide=function()
{	var t_=this;
	if(t_.keybind){t_.par.readOnly=false;}
	t_.maindiv.style.display='none';
};
DTpicker.prototype.hidedelay=function(e)
{	var t_=this;
	if(e){DTpicker.evtcancel(e);}
	if(isNaN(t_.hidetimeout)|| t_.hidetimeout<0){return;}	
	if(!t_.hidetimer)
	{	t_.hidetimer=setTimeout(function(e){t_.hidedelay();},t_.hidetimeout);
		return;
	}t_.hidetimer=null;
	t_.hide();
};
DTpicker.prototype.hidecancel=function(e)
{	var t_=this;
	DTpicker.evtcancel(e);
	if(t_.hidetimer)
	{	clearTimeout(t_.hidetimer);
		t_.hidetimer=null;	
	}
};

DTpicker.prototype.keyupfunc=function(e)
{	var t_=this,dinc,k=e.keyCode;	
	if(e){DTpicker.evtcancel(e);}	
	if(k==27||k==46){t_.hide();}
	else if(k==13){t_.submit();t_.hide();}
	else if(k==46){t_.clear();}
	/*37~40= left up right down*/
	else if(k==37){dinc=-1;}
	else if(k==38){dinc=-7;}
	else if(k==39){dinc=1;}
	else if(k==40){dinc=7;}
	if(!isNaN(dinc))
	{	if(isNaN(t_.dtime))
		{	t_.inittimeset();
			t_.dtime=t_.ymDT.getTime();
		}var dobj=new Date();dobj.setTime(t_.dtime);
		dobj.setDate(dobj.getDate()+dinc);		
		t_.selecttime(dobj.getTime());
	}return k;
};
DTpicker.prototype.selecttime=function(dt)
{	var t_=this;
	if(isNaN(dt)&& dt.getAttribute)
	{	dt=parseFloat(dt.getAttribute('dtime'));
	}if(isNaN(dt)){return false;}	
	if(!isNaN(t_.starttime)&& dt<t_.starttime)
	{	dt=t_.starttime;
	}else if(!isNaN(t_.endtime)&& dt>t_.endtime)
	{	dt=t_.endtime;
	}if(t_.dtime==dt){return false;}
	t_.dtime=dt;
	t_.ymDT.setTime(t_.dtime);		
	t_.calcells();
	t_.submit();
};
DTpicker.prototype.calinit=function()
{	var t_=this,dobj=new Date();
	t_.ymDT=new Date();
	t_.maindiv=document.createElement('div');
	t_.maindiv.className='cal_maindiv';
	t_.monthsel=document.createElement('div');
	t_.maindiv.appendChild(t_.monthsel);
	var wkdydiff=(t_.weekstartday-dobj.getDay()+7)%7;
	dobj.setDate(dobj.getDate()+wkdydiff);
	t_.wkrow=document.createElement('div');
	t_.wkrow.className='cal_cellrow';
	t_.maindiv.appendChild(t_.wkrow);
	for(var d=0;d<7;d++)
	{	var wkstr=dobj.toDateString();		
		if(t_.locale)
		{	wkstr=dobj.toLocaleDateString(t_.locale,{weekday:'short',month:'short'});
		}wkstr=wkstr.replace(/^\s+/,'').replace(/[^a-z].+/i,'');
		if(!isNaN(t_.wkheadlen)&& wkstr.length>=t_.wkheadlen)
		{	wkstr=wkstr.substr(0,t_.wkheadlen);
		}var wkdy=(t_.weekstartday+d+7)%7;		
		var cell=document.createElement('span');
		cell.innerHTML=wkstr;	
		cell.className='cal_head';
		if(wkdy<1||wkdy>5){cell.className+=' cal_wkend';}		
		t_.wkrow.appendChild(cell);
		dobj.setDate(dobj.getDate()+1);
	}if(t_.keybind)
	{	var cell=document.createElement('input');
		cell.setAttribute('type','button');
		with(cell.style){border='0';padding='0';margin='0';width='1px';}		
		cell.value='';
		t_.keyct=cell;
		DTpicker.evtadd(t_.keyct,'keyup',function(e){t_.keyupfunc(e);});
		DTpicker.evtadd(t_.keyct,'focus',function(e){t_.hidecancel();});
		DTpicker.evtadd(t_.keyct,'blur',function(e){t_.hidedelay(e);});
		t_.wkrow.appendChild(cell);
	}for(var r=0;r<5;r++)
	{	t_.cellrows[r]=document.createElement('div');
		t_.cellrows[r].className='cal_cellrow';
		t_.maindiv.appendChild(t_.cellrows[r]);		
	}var tmaxchkfunc=function(e,el){if(!el){el=this};t_.tinput_maxchk(el);};
	if(t_.timeinput&& !t_.timeinput.tagName)
	{	t_.timeinput=document.createElement('div');
		t_.maindiv.appendChild(t_.timeinput);
		if(!t_.timeinputmax|| t_.timeinputmax=={})
		{	t_.timeinputmax={'Hours':24,'Minutes':60};
		}
		var tlbl=document.createElement('span');
		tlbl.className='cal_timelbl';
		tlbl.innerHTML='Time ';
		t_.timeinput.appendChild(tlbl);
		for(var k in t_.timeinputmax)
		{	var inp=document.createElement('input');			
			inp.setAttribute('name',k);
			inp.className='cal_timeinput';
			DTpicker.evtadd(inp,'blur',tmaxchkfunc);
			DTpicker.evtadd(inp,'focus',function(e){t_.hidecancel();});
			t_.timeinput.appendChild(inp);
			t_.timeinput.appendChild(document.createTextNode(':'));
			t_[k+'_input']=inp;
		}t_.timeinput.removeChild(t_.timeinput.lastChild);
		var btn=document.createElement('input');
		btn.value='OK';btn.className='cal_timebtn';
		btn.setAttribute('type','button');
		DTpicker.evtadd(btn,'click',function(e,el){t_.submit();t_.calcells();t_.hide();});
		t_.timeinput.appendChild(btn);
		btn=document.createElement('input');
		btn.value='clear';btn.className='cal_timebtn';
		btn.setAttribute('type','button');
		DTpicker.evtadd(btn,'click',function(e,el){t_.clear();t_.hide();});		
		t_.timeinput.appendChild(btn);
	}t_.partop.appendChild(t_.maindiv);	
	t_.partop.style.position='relative';
	t_.par.setAttribute('DTpicker',t_);
};
DTpicker.prototype.ymDTset=function(k,v)
{	var t_=this;
	if(!(typeof(v)).match(/^(str|num)/i)&& v.value)
	{	v=v.value;
	}if(isNaN(v))
	{	v=parseFloat(v);
	}if(isNaN(v))
	{	return false;
	}t_.ymDT['set'+k](v);
	t_.calcells();
	return v;
};
DTpicker.prototype.calmonthsel_dropdown=function()
{	var t_=this,dobj=new Date(),dto,yr0,mo0,sel;
	dto=t_.ymDT.getTime();yr0=t_.ymDT.getFullYear();mo0=t_.ymDT.getMonth();	
	sel=document.createElement('select');
	sel.name='year'; sel.classNae='cal_dropdown';
	sel.onchange=function(e,nd){if(!nd){nd=this;}t_.ymDTset('FullYear',nd);};	
	DTpicker.evtadd(sel,'focus',function(e){t_.hidecancel();});
	t_.monthsel.appendChild(sel);
	var yrstart=yr0-10,yrend=yr0+10;
	if(!isNaN(t_.starttime))
	{	dobj.setTime(t_.starttime);
		yrstart=dobj.getFullYear();
	}if(!isNaN(t_.endtime))
	{	dobj.setTime(t_.endtime);
		yrend=dobj.getFullYear();
	}dobj.setTime(dto);dobj.setMonth(0);dobj.setDate(1);
	for(var yr=yrstart;yr<=yrend;yr++)
	{	dobj.setFullYear(yr);
		var ostr=yr;
		if(t_.ymformatfunc)
		{	ostr=t_.ymformatfunc(dobj,'y');
		}var opt=document.createElement('option');
		if(yr0==yr){opt.selected='selected';}
		opt.value=yr;
		opt.innerHTML=ostr;
		sel.appendChild(opt);
	}dobj.setTime(dto);dobj.setDate(1);
	sel=document.createElement('select');
	sel.name='month'; sel.classNae='cal_dropdown';
	sel.onchange=function(e,nd){if(!nd){nd=this;}t_.ymDTset('Month',nd);};
	DTpicker.evtadd(sel,'focus',function(e){t_.hidecancel();});
	t_.monthsel.appendChild(sel);
	for(var m=0;m<12;m++)
	{	dobj.setMonth(m+1);var dt=dobj.getTime();
		if(!isNaN(t_.starttime)&& dt<=t_.starttime)
		{	continue;
		}dobj.setMonth(m);dt=dobj.getTime();
		if(!isNaN(t_.endtime)&& dt>t_.endtime)
		{	break;
		}var ostr=m;
		if(t_.ymformatfunc)
		{	ostr=t_.ymformatfunc(dobj,'m');
		}else
		{	ostr=dobj.toLocaleDateString(t_.locale,{month:'long'});			
			ostr=ostr.replace(/^[^\s]+\s/,'').replace(/[\s-].*/,'');
		}var opt=document.createElement('option');
		if(mo0==m){opt.selected='selected';}
		opt.value=m;
		opt.innerHTML=ostr;
		sel.appendChild(opt);
	}
};
DTpicker.prototype.calmonthsel_scroller=function()
{	var t_=this,dobj=new Date(),nd,dt,dto;	
	dto=t_.ymDT.getTime();dobj.setTime(dto);
	nd=document.createElement('span');
	nd.innerHTML='&lt;&lt;';
	nd.className='cal_monthbtn';
	dobj.setTime(dto);dobj.setFullYear(dobj.getFullYear()-1);dt=dobj.getTime();
	if(!isNaN(t_.starttime)&& dt<=t_.starttime)
	{	nd.className+=' cal_disable';
	}else
	{	nd.style.cursor='pointer';
		nd.onclick=function(e,nd){t_.ymDTset('FullYear',t_.ymDT.getFullYear()-1);};
	}t_.monthsel.appendChild(nd);
	nd=document.createElement('span');	
	nd.innerHTML='&lt;';
	nd.className='cal_monthbtn';
	dobj.setTime(dto);dt=dobj.getTime();
	if(!isNaN(t_.starttime)&& dt<=t_.starttime)
	{	nd.className+=' cal_disable';
	}else
	{	nd.style.cursor='pointer';
		nd.onclick=function(e,nd){t_.ymDTset('Month',t_.ymDT.getMonth()-1);};
	}t_.monthsel.appendChild(nd);	
	nd=document.createElement('span');
	dobj.setTime(dto);
	var yrmostr=dobj.getFullYear()+'-'+(dobj.getMonth()+1);
	if(t_.ymformatfunc)
	{	yrmostr=t_.ymformatfunc(dobj,'ym');
	}else
	{	var mostr=dobj.toDateString();
		if(t_.locale)
		{	mostr=dobj.toLocaleDateString(t_.locale,{weekday:'short',month:'short'});
		}mostr=mostr.replace(/^[^\s]+\s/,'').replace(/\s.*/,'');
		yrmostr=dobj.getFullYear()+'-'+mostr;
	}nd.innerHTML=yrmostr;
	nd.className='cal_monthlbl';
	nd.style.cursor='pointer';
	nd.onclick=function(e,nd){t_.ymDTset('Time',t_.inittime);};
	t_.monthsel.appendChild(nd);
	nd=document.createElement('span');	
	nd.innerHTML='&gt;';
	nd.className='cal_monthbtn';
	dobj.setTime(dto);dobj.setMonth(dobj.getMonth()+1);dt=dobj.getTime();	
	if(!isNaN(t_.endtime)&& dt>t_.endtime)
	{	nd.className+=' cal_disable';
	}else
	{	nd.style.cursor='pointer';
		nd.onclick=function(e,nd){t_.ymDTset('Month',t_.ymDT.getMonth()+1);};
	}t_.monthsel.appendChild(nd);
	nd=document.createElement('span');	
	nd.innerHTML='&gt;&gt;';
	nd.className='cal_monthbtn';
	dobj.setTime(dt);dobj.setFullYear(dobj.getFullYear()+1);dt=dobj.getTime();
	if(!isNaN(t_.endtime)&& dt>t_.endtime)
	{	nd.className+=' cal_disable';
	}else
	{	nd.style.cursor='pointer';
		nd.onclick=function(e,nd){t_.ymDTset('FullYear',t_.ymDT.getFullYear()+1);};
	}t_.monthsel.appendChild(nd);
	return t_.monthsel;
};
DTpicker.prototype.inittimeset=function()
{	var t_=this,dobj=new Date(),dt;	
	dt=t_.ymDT.getTime();
	if(!isNaN(t_.inittime))
	{	dobj.setTime(t_.inittime);dobj.setMonth(dobj.getMonth()+1);dt=dobj.getTime();
	}
	if(isNaN(t_.inittime)|| 
		(!isNaN(t_.starttime)&& dt<=t_.starttime)|| 
		(!isNaN(t_.endtime)&& t_.inittime>t_.endtime))
	{	dobj=new Date();
		if(!isNaN(t_.endtime))
		{	dobj.setTime(t_.endtime);
		}else if(!isNaN(t_.starttime))
		{	dobj.setTime(t_.starttime);
		}dobj.setDate(1);
		t_.inittime=dobj.getTime();
		t_.ymDT.setTime(t_.inittime);
	}
	for(var k in {'Hours':1,'Minutes':1,'Seconds':1,'Milliseconds':1})
	{	t_.ymDT['set'+k](0);
	}t_.ymDT.setDate(1);
	return t_.inittime;
}
DTpicker.prototype.calcells=function()
{	var t_=this,dobj=new Date(),wkdydiff,yr,mo,mdays,mdaysprev;	
	t_.inittimeset();
	t_.monthsel.innerHTML='';
	if(t_.monthselector&& t_.monthselector.match(/drop/i))
	{	t_.calmonthsel_dropdown();
	}else
	{	t_.calmonthsel_scroller();
	}
	dobj.setTime(t_.ymDT.getTime());
	yr=dobj.getFullYear(); mo=dobj.getMonth();
	mdays=DTpicker.monthdays(yr,mo); mdaysprev=DTpicker.monthdays(yr,mo-1);
	wkdydiff=t_.weekstartday-dobj.getDay();
	for(var r=0;r<5;r++)
	{	t_.cellrows[r].innerHTML='';
		for(var d=0;d<7;d++)
		{	var dn=(r*7)+d+wkdydiff+1;
			var cell=document.createElement('span');
			cell.className='cal_cell';
			if(dn<1||dn>mdays)
			{	cell.className+=' cal_disable';				
				cell.innerHTML='';
			}else
			{	cell.innerHTML=dn;
				dobj.setDate(dn); var dt=dobj.getTime();
				if((!isNaN(t_.starttime)&& dt+86400000<=t_.starttime)||
					(!isNaN(t_.endtime)&&dt>t_.endtime))
				{	cell.className+=' cal_disable';
				}else
				{	cell.setAttribute('dtime',dt);					
					var wkdy=(t_.weekstartday+d+7)%7;
					if(wkdy<1||wkdy>5){cell.className+=' cal_wkend';}
					if(!isNaN(t_.dtime)&& t_.dtime>=dt&& t_.dtime<dt+86400000)
					{	cell.className+=' cal_sel';
					}
					cell.style.cursor='pointer';
					DTpicker.evtadd(cell,'mousedown',function(e,el){if(!el){el=this};t_.selecttime(el);t_.hide();});
				}
			}t_.cellrows[r].appendChild(cell);
		}
	}
}
DTpicker.prototype.tinput_maxchk=function(el)
{	var t_=this,ud;
	if(el==ud||el.value==ud||!el.value.match(/\d/)){return false;}
	var v=el.value;	v=v.replace(/[^0-9]/g,'');	
	v=parseFloat(v);
	var nam=el.getAttribute('name');
	if(isNaN(v)||v<0)
	{	v=0;
	}else if(nam&& !isNaN(t_.timeinputmax[nam])&& v>t_.timeinputmax[nam])
	{	v=t_.timeinputmax[nam];
	}el.value=(v<10?'0':'')+v;
	return v;
};
DTpicker.prototype.clear=function(el)
{	var t_=this;
	t_.ymDT.setTime(t_.inittime);	
	for(var k in t_.timeinputmax)
	{	if(t_[k+'_input'])
		{	t_[k+'_input'].value='';
		}
	}if(t_.par.tagName.match(/input/i))
	{	t_.par.value='';
	}else
	{	t_.par.innerHTML='';
	}t_.timeval=null;t_.dtime=null;
	t_.calcells();
};
DTpicker.prototype.submit=function()
{	var t_=this,dobj=new Date(),str;
	if(isNaN(t_.dtime))
	{	t_.dtime=t_.ymDT.getTime();
	}dobj.setTime(t_.dtime);
	if(t_.timeinput)
	{	for(var k in t_.timeinputmax)
		{	if(t_[k+'_input']&& t_[k+'_input'].value)
			{	var v=parseFloat(t_[k+'_input'].value);
				if(!isNaN(v)&& v>=0&&v<t_.timeinputmax[k])
				{	dobj['set'+k](v);
				}
			}
		}
	}t_.timeval=dobj.getTime();
	if(t_.valformatfunc)
	{	str=t_.valformatfunc(dobj);
	}if(!str)
	{	str=dobj.toDateString();
		if(t_.timeinput)
		{	str+=' '+dobj.toTimeString();
		}
	}if(t_.par.innerHTML&& str==t_.par.innerHTML)
	{	return str;
	}	
	if(t_.par.tagName.match(/input/i))
	{	t_.par.value=str;
	}else
	{	t_.par.innerHTML=str;
	}if(t_.submitendfunc)
	{	t_.submitendfunc(t_);
	}	
}
/*------------------- helper functions -------------------*/
DTpicker.getdateinput=function()
{	var inp=document.createElement('input'),ty='date',ndval='NOTDATE';
	inp.setAttribute('type',ty);
	inp.setAttribute('value',ndval); 
	if(inp.type==ty&& inp.value!==ndval)
	{	return inp;
	}return null;
};
DTpicker.evtcancel=function(a)
{	a=a?a:window.event;
	if(a.preventDefault){a.preventDefault();
	if(a.stopPropagation){a.stopPropagation();}}
	else{a.returnValue=false;a.cancelBubble=true;}
};
DTpicker.evtadd=function(el,e,fn)
{	var f2=fn,ud;
	if(el==ud|| fn==ud|| !(typeof(e)).match(/^str/i))
	{	return false;
	}if(el.addEventListener)
	{	el.addEventListener(e,f2,false);
	}else if(el.attachEvent)
	{	f2=function(){return fn(window.event,el);};
		el.attachEvent('on'+e,f2);
	}return f2;
};
DTpicker.monthdays=function(y1,m1)
{	y1=parseInt(y1);m1=parseInt(m1);
	if(isNaN(y1)||isNaN(m1))
	{	return null;
	}while(m1<0){m1+=12;y1--;}	
	return new Date(y1,(m1+1),0).getDate();
};
