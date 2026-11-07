#!/usr/bin/env python3
"""Compare two rank.py outputs: compare-ranks.py OLD.json NEW.json APP_ID. Prints pairs ranked, top-10 counts, and the terms gained and lost."""
import json,sys
old=json.load(open(sys.argv[1])); new=json.load(open(sys.argv[2])); app=sys.argv[3]
O=old.get('res',old); N=new['res']
def rk(v):
    if v is None: return None
    if 'rank' in v: return v['rank']
    if 'und' in v: return v['und']
    ids=v.get('ids') or [t['id'] for t in v.get('top',[])]
    return ids.index(app)+1 if app in ids else None
rows=[]
for k,v in N.items():
    o=O.get(k); r0=rk(o) if o else 'n/a'; r1=v['rank']
    rows.append((k,r0,r1,o.get('n') if o else None,v['n']))
up=[r for r in rows if r[2] and (r[1] in (None,'n/a') or (isinstance(r[1],int) and r[2]<r[1]))]
down=[r for r in rows if isinstance(r[1],int) and (r[2] is None or r[2]>r[1])]
same=[r for r in rows if isinstance(r[1],int) and r[2]==r[1]]
print('pairs',len(rows),'ranked before',sum(isinstance(r[1],int) for r in rows),'ranked now',sum(bool(r[2]) for r in rows))
print('top10 before',sum(isinstance(r[1],int) and r[1]<=10 for r in rows),'top10 now',sum(bool(r[2]) and r[2]<=10 for r in rows))
print('-- improved/new'); [print(' ',*r) for r in sorted(up,key=lambda r:r[2])[:45]]
print('-- worse/lost'); [print(' ',*r) for r in sorted(down,key=lambda r:r[1])[:30]]
