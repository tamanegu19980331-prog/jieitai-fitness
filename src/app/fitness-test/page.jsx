'use client'
import { useState } from 'react'

const standards = {
  自衛隊: {
    '20代': { 腕立て: 30, 腹筋: 30, 懸垂: 8, '3km': 810 },
    '30代': { 腕立て: 25, 腹筋: 25, 懸垂: 6, '3km': 870 },
  },
  消防士: {
    '20代': { 腕立て: 30, 腹筋: 30, 懸垂: 10, '3km': 780 },
    '30代': { 腕立て: 25, 腹筋: 25, 懸垂: 8, '3km': 840 },
  },
  警察官: {
    '20代': { 腕立て: 25, 腹筋: 25, 懸垂: 6, '3km': 840 },
    '30代': { 腕立て: 20, 腹筋: 20, 懸垂: 5, '3km': 870 },
  },
}

export default function FitnessTestPage() {
  const [job, setJob] = useState('自衛隊')
  const [age, setAge] = useState('20代')
  const [scores, setScores] = useState({ 腕立て: '', 腹筋: '', 懸垂: '', '3km分': '', '3km秒': '' })
  const [result, setResult] = useState(null)

  const judge = () => {
    const std = standards[job][age]
    const sec = parseInt(scores['3km分'] || 0) * 60 + parseInt(scores['3km秒'] || 0)
    const items = [
      { name: '腕立て', score: parseInt(scores.腕立て || 0), std: std.腕立て, unit: '回', higher: true },
      { name: '腹筋', score: parseInt(scores.腹筋 || 0), std: std.腹筋, unit: '回', higher: true },
      { name: '懸垂', score: parseInt(scores.懸垂 || 0), std: std.懸垂, unit: '回', higher: true },
      { name: '3km走', score: sec, std: std['3km'], unit: '秒', higher: false },
    ]
    setResult(items)
  }

  const formatTime = (sec) => `${Math.floor(sec/60)}分${sec%60}秒`

  return (
    <div style={{minHeight:'100vh',background:'#0a0a0a',color:'white',padding:'2rem'}}>
      <div style={{maxWidth:'600px',margin:'0 auto'}}>
        <h1 style={{textAlign:'center',color:'#4ade80',fontSize:'1.5rem',marginBottom:'0.5rem'}}>
          🎖️ 体力検定診断
        </h1>
        <p style={{textAlign:'center',color:'#666',marginBottom:'2rem',fontSize:'0.9rem'}}>
          ※各自治体・採用年度により基準が異なります
        </p>

        {/* 職種選択 */}
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{color:'#4ade80',marginBottom:'0.5rem'}}>職種</div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {['自衛隊','消防士','警察官'].map(j => (
              <button key={j} onClick={() => setJob(j)} style={{
                flex:1, padding:'0.8rem', border:`2px solid ${job===j?'#4ade80':'#333'}`,
                background: job===j?'#4ade80':'transparent', color: job===j?'#000':'#fff',
                borderRadius:'0.5rem', cursor:'pointer', fontWeight:'bold'
              }}>{j}</button>
            ))}
          </div>
        </div>

        {/* 年齢選択 */}
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{color:'#4ade80',marginBottom:'0.5rem'}}>年齢</div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            {['20代','30代'].map(a => (
              <button key={a} onClick={() => setAge(a)} style={{
                flex:1, padding:'0.8rem', border:`2px solid ${age===a?'#4ade80':'#333'}`,
                background: age===a?'#4ade80':'transparent', color: age===a?'#000':'#fff',
                borderRadius:'0.5rem', cursor:'pointer', fontWeight:'bold'
              }}>{a}</button>
            ))}
          </div>
        </div>

        {/* 記録入力 */}
        <div style={{marginBottom:'1.5rem'}}>
          <div style={{color:'#4ade80',marginBottom:'0.5rem'}}>記録入力</div>
          {['腕立て','腹筋','懸垂'].map(k => (
            <div key={k} style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'0.8rem'}}>
              <div style={{width:'80px',color:'#aaa'}}>{k}</div>
              <input type="number" placeholder="0" value={scores[k]}
                onChange={e => setScores({...scores,[k]:e.target.value})}
                style={{flex:1,padding:'0.8rem',background:'#1a1a1a',border:'1px solid #333',
                  borderRadius:'0.5rem',color:'white',fontSize:'1rem'}}/>
              <div style={{color:'#666'}}>回</div>
            </div>
          ))}
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.8rem'}}>
            <div style={{width:'80px',color:'#aaa'}}>3km走</div>
            <input type="number" placeholder="13" value={scores['3km分']}
              onChange={e => setScores({...scores,'3km分':e.target.value})}
              style={{flex:1,padding:'0.8rem',background:'#1a1a1a',border:'1px solid #333',
                borderRadius:'0.5rem',color:'white',fontSize:'1rem'}}/>
            <div style={{color:'#666'}}>分</div>
            <input type="number" placeholder="30" value={scores['3km秒']}
              onChange={e => setScores({...scores,'3km秒':e.target.value})}
              style={{flex:1,padding:'0.8rem',background:'#1a1a1a',border:'1px solid #333',
                borderRadius:'0.5rem',color:'white',fontSize:'1rem'}}/>
            <div style={{color:'#666'}}>秒</div>
          </div>
        </div>

        <button onClick={judge} style={{
          width:'100%',padding:'1rem',background:'#4ade80',color:'#000',
          fontWeight:'bold',border:'none',borderRadius:'0.5rem',
          cursor:'pointer',fontSize:'1.1rem',marginBottom:'2rem'
        }}>判定する</button>

        {/* 結果 */}
        {result && (
          <div>
            {result.map(item => {
              const pass = item.higher ? item.score >= item.std : item.score <= item.std && item.score > 0
              const diff = item.higher ? item.std - item.score : item.score - item.std
              return (
                <div key={item.name} style={{
                  background: pass?'#0f2a1a':'#2a0f0f',
                  border:`1px solid ${pass?'#4ade80':'#f87171'}`,
                  borderRadius:'0.5rem',padding:'1rem',marginBottom:'0.8rem'
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{fontWeight:'bold'}}>{item.name}</div>
                    <div style={{color:pass?'#4ade80':'#f87171',fontWeight:'bold'}}>
                      {pass ? '✅ 合格' : '❌ 不合格'}
                    </div>
                  </div>
                  <div style={{color:'#aaa',fontSize:'0.9rem',marginTop:'0.3rem'}}>
                    あなた: {item.name==='3km走' ? formatTime(item.score) : `${item.score}${item.unit}`}
                    　／　基準: {item.name==='3km走' ? formatTime(item.std) : `${item.std}${item.unit}`}
                  </div>
                  {!pass && item.score > 0 && (
                    <div style={{color:'#fbbf24',fontSize:'0.9rem',marginTop:'0.3rem'}}>
                      {item.higher
                        ? `あと ${diff}${item.unit} で合格！`
                        : `あと ${formatTime(diff)} 縮めれば合格！`}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}








