(module
 (type $0 (func (param i32 i32) (result i32)))
 (type $1 (func (result i32)))
 (type $2 (func (param i32) (result i32)))
 (type $3 (func (param i32 i32 i32)))
 (type $4 (func (param i32 i32 i32) (result i32)))
 (type $5 (func))
 (type $6 (func (param i32 i32 i32 i32)))
 (type $7 (func (param i32 i32)))
 (import "env" "abort" (func $~lib/builtins/abort (param i32 i32 i32 i32)))
 (global $assembly/index/signResult (mut i32) (i32.const 1600))
 (global $assembly/index/fpResult (mut i32) (i32.const 1600))
 (global $assembly/index/integrityResult (mut i32) (i32.const 1600))
 (global $~lib/rt/stub/offset (mut i32) (i32.const 0))
 (global $~argumentsLength (mut i32) (i32.const 0))
 (memory $0 1)
 (data $0 (i32.const 1036) "<")
 (data $0.1 (i32.const 1048) "\02\00\00\00 \00\00\008\00d\007\001\008\004\001\006\000\001\00c\007\009\005\001\00e")
 (data $1 (i32.const 1100) "<")
 (data $1.1 (i32.const 1112) "\04\00\00\00%\00\00\001r/q}\173\12q\14}\17q%\14q2}\17v.2}4s}&r},r2}.qv)")
 (data $2 (i32.const 1164) "<")
 (data $2.1 (i32.const 1176) "\04\00\00\00 \00\00\00$\12}1v.2}4p} \14r5\17q\14}s&q,2s27}*v\17*")
 (data $3 (i32.const 1228) "\1c\01")
 (data $3.1 (i32.const 1240) "\05\00\00\00\00\01\00\00\98/\8aB\91D7q\cf\fb\c0\b5\a5\db\b5\e9[\c2V9\f1\11\f1Y\a4\82?\92\d5^\1c\ab\98\aa\07\d8\01[\83\12\be\851$\c3}\0cUt]\ber\fe\b1\de\80\a7\06\dc\9bt\f1\9b\c1\c1i\9b\e4\86G\be\ef\c6\9d\c1\0f\cc\a1\0c$o,\e9-\aa\84tJ\dc\a9\b0\\\da\88\f9vRQ>\98m\c61\a8\c8\'\03\b0\c7\7fY\bf\f3\0b\e0\c6G\91\a7\d5Qc\ca\06g))\14\85\n\b7\'8!\1b.\fcm,M\13\r8STs\ne\bb\njv.\c9\c2\81\85,r\92\a1\e8\bf\a2Kf\1a\a8p\8bK\c2\a3Ql\c7\19\e8\92\d1$\06\99\d6\855\0e\f4p\a0j\10\16\c1\a4\19\08l7\1eLwH\'\b5\bc\b04\b3\0c\1c9J\aa\d8NO\ca\9c[\f3o.h\ee\82\8ftoc\a5x\14x\c8\84\08\02\c7\8c\fa\ff\be\90\eblP\a4\f7\a3\f9\be\f2xq\c6")
 (data $4 (i32.const 1516) "<")
 (data $4.1 (i32.const 1528) "\05\00\00\00 \00\00\00g\e6\tj\85\aeg\bbr\f3n<:\f5O\a5\7fR\0eQ\8ch\05\9b\ab\d9\83\1f\19\cd\e0[")
 (data $5 (i32.const 1580) "\1c")
 (data $5.1 (i32.const 1592) "\02")
 (data $6 (i32.const 1612) "<")
 (data $6.1 (i32.const 1624) "\02\00\00\00(\00\00\00A\00l\00l\00o\00c\00a\00t\00i\00o\00n\00 \00t\00o\00o\00 \00l\00a\00r\00g\00e")
 (data $7 (i32.const 1676) "<")
 (data $7.1 (i32.const 1688) "\02\00\00\00\1e\00\00\00~\00l\00i\00b\00/\00r\00t\00/\00s\00t\00u\00b\00.\00t\00s")
 (data $8 (i32.const 1740) "<")
 (data $8.1 (i32.const 1752) "\02\00\00\00$\00\00\00I\00n\00d\00e\00x\00 \00o\00u\00t\00 \00o\00f\00 \00r\00a\00n\00g\00e")
 (data $9 (i32.const 1804) "<")
 (data $9.1 (i32.const 1816) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00s\00t\00a\00t\00i\00c\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $10 (i32.const 1868) ",")
 (data $10.1 (i32.const 1880) "\02\00\00\00\1c\00\00\00I\00n\00v\00a\00l\00i\00d\00 \00l\00e\00n\00g\00t\00h")
 (data $11 (i32.const 1916) "<")
 (data $11.1 (i32.const 1928) "\02\00\00\00&\00\00\00~\00l\00i\00b\00/\00a\00r\00r\00a\00y\00b\00u\00f\00f\00e\00r\00.\00t\00s")
 (data $12 (i32.const 1980) "<")
 (data $12.1 (i32.const 1992) "\02\00\00\00$\00\00\00~\00l\00i\00b\00/\00t\00y\00p\00e\00d\00a\00r\00r\00a\00y\00.\00t\00s")
 (data $13 (i32.const 2044) "<")
 (data $13.1 (i32.const 2056) "\02\00\00\00 \00\00\000\001\002\003\004\005\006\007\008\009\00a\00b\00c\00d\00e\00f")
 (data $14 (i32.const 2108) "\1c")
 (data $14.1 (i32.const 2120) "\02\00\00\00\02\00\00\00|")
 (export "alloc" (func $assembly/index/alloc))
 (export "signRequest" (func $assembly/index/signRequest))
 (export "getSignResultPtr" (func $assembly/index/getSignResultPtr))
 (export "getSignResultLen" (func $assembly/index/getSignResultLen))
 (export "generateFingerprint" (func $assembly/index/generateFingerprint))
 (export "getFpResultPtr" (func $assembly/index/getFpResultPtr))
 (export "getFpResultLen" (func $assembly/index/getFpResultLen))
 (export "computeIntegrityHash" (func $assembly/index/computeIntegrityHash))
 (export "getIntegrityResultPtr" (func $assembly/index/getIntegrityResultPtr))
 (export "getIntegrityResultLen" (func $assembly/index/getIntegrityResultLen))
 (export "memory" (memory $0))
 (start $~start)
 (func $~lib/rt/stub/__alloc (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  local.get $0
  i32.const 1073741820
  i32.gt_u
  if
   i32.const 1632
   i32.const 1696
   i32.const 33
   i32.const 29
   call $~lib/builtins/abort
   unreachable
  end
  global.get $~lib/rt/stub/offset
  global.get $~lib/rt/stub/offset
  i32.const 4
  i32.add
  local.tee $2
  local.get $0
  i32.const 19
  i32.add
  i32.const -16
  i32.and
  i32.const 4
  i32.sub
  local.tee $0
  i32.add
  local.tee $3
  memory.size
  local.tee $4
  i32.const 16
  i32.shl
  i32.const 15
  i32.add
  i32.const -16
  i32.and
  local.tee $5
  i32.gt_u
  if
   local.get $4
   local.get $3
   local.get $5
   i32.sub
   i32.const 65535
   i32.add
   i32.const -65536
   i32.and
   i32.const 16
   i32.shr_u
   local.tee $5
   local.get $4
   local.get $5
   i32.gt_s
   select
   memory.grow
   i32.const 0
   i32.lt_s
   if
    local.get $5
    memory.grow
    i32.const 0
    i32.lt_s
    if
     unreachable
    end
   end
  end
  local.get $3
  global.set $~lib/rt/stub/offset
  local.get $0
  i32.store
  local.get $2
 )
 (func $assembly/index/alloc (param $0 i32) (result i32)
  local.get $0
  call $~lib/rt/stub/__alloc
 )
 (func $~lib/rt/stub/__new (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  local.get $0
  i32.const 1073741804
  i32.gt_u
  if
   i32.const 1632
   i32.const 1696
   i32.const 86
   i32.const 30
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.const 16
  i32.add
  call $~lib/rt/stub/__alloc
  local.tee $3
  i32.const 4
  i32.sub
  local.tee $2
  i32.const 0
  i32.store offset=4
  local.get $2
  i32.const 0
  i32.store offset=8
  local.get $2
  local.get $1
  i32.store offset=12
  local.get $2
  local.get $0
  i32.store offset=16
  local.get $3
  i32.const 16
  i32.add
 )
 (func $~lib/string/String.fromCharCode@varargs (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  block $1of1
   block $0of1
    block $outOfRange
     global.get $~argumentsLength
     i32.const 1
     i32.sub
     br_table $0of1 $1of1 $outOfRange
    end
    unreachable
   end
   i32.const -1
   local.set $1
  end
  i32.const 2
  local.get $1
  i32.const 0
  i32.gt_s
  local.tee $3
  i32.shl
  i32.const 2
  call $~lib/rt/stub/__new
  local.tee $2
  local.get $0
  i32.store16
  local.get $3
  if
   local.get $2
   local.get $1
   i32.store16 offset=2
  end
  local.get $2
 )
 (func $~lib/string/String.__concat (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  i32.const 1600
  local.set $2
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  local.tee $3
  local.get $1
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const -2
  i32.and
  local.tee $4
  i32.add
  local.tee $5
  if
   local.get $5
   i32.const 2
   call $~lib/rt/stub/__new
   local.tee $2
   local.get $0
   local.get $3
   memory.copy
   local.get $2
   local.get $3
   i32.add
   local.get $1
   local.get $4
   memory.copy
  end
  local.get $2
 )
 (func $assembly/index/readString (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  i32.const 1600
  local.set $2
  loop $for-loop|0
   local.get $1
   local.get $3
   i32.gt_s
   if
    local.get $0
    local.get $3
    i32.add
    i32.load8_u
    local.set $4
    i32.const 1
    global.set $~argumentsLength
    local.get $2
    local.get $4
    call $~lib/string/String.fromCharCode@varargs
    call $~lib/string/String.__concat
    local.set $2
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $for-loop|0
   end
  end
  local.get $2
 )
 (func $assembly/index/decodeSalt (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  i32.const 1600
  local.set $2
  loop $for-loop|0
   local.get $1
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   local.tee $3
   i32.lt_s
   if
    local.get $1
    local.get $3
    i32.ge_u
    if
     i32.const 1760
     i32.const 1824
     i32.const 78
     i32.const 41
     call $~lib/builtins/abort
     unreachable
    end
    local.get $0
    local.get $1
    i32.add
    i32.load8_u
    i32.const 66
    i32.xor
    local.set $3
    i32.const 1
    global.set $~argumentsLength
    local.get $2
    local.get $3
    call $~lib/string/String.fromCharCode@varargs
    call $~lib/string/String.__concat
    local.set $2
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|0
   end
  end
  local.get $2
 )
 (func $~lib/arraybuffer/ArrayBufferView#constructor (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  local.get $0
  i32.eqz
  if
   i32.const 12
   i32.const 3
   call $~lib/rt/stub/__new
   local.set $0
  end
  local.get $0
  i32.const 0
  i32.store
  local.get $0
  i32.const 0
  i32.store offset=4
  local.get $0
  i32.const 0
  i32.store offset=8
  local.get $1
  i32.const 1073741820
  local.get $2
  i32.shr_u
  i32.gt_u
  if
   i32.const 1888
   i32.const 1936
   i32.const 19
   i32.const 57
   call $~lib/builtins/abort
   unreachable
  end
  local.get $1
  local.get $2
  i32.shl
  local.tee $1
  i32.const 1
  call $~lib/rt/stub/__new
  local.tee $2
  i32.const 0
  local.get $1
  memory.fill
  local.get $0
  local.get $2
  i32.store
  local.get $0
  local.get $2
  i32.store offset=4
  local.get $0
  local.get $1
  i32.store offset=8
  local.get $0
 )
 (func $~lib/string/String#charCodeAt (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
  i32.ge_u
  if
   i32.const -1
   return
  end
  local.get $0
  local.get $1
  i32.const 1
  i32.shl
  i32.add
  i32.load16_u
 )
 (func $~lib/typedarray/Uint8Array#__set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 1760
   i32.const 2000
   i32.const 178
   i32.const 45
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.add
  local.get $2
  i32.store8
 )
 (func $~lib/staticarray/StaticArray<u32>#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1760
   i32.const 1824
   i32.const 78
   i32.const 41
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
 )
 (func $~lib/typedarray/Uint8Array#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.ge_u
  if
   i32.const 1760
   i32.const 2000
   i32.const 167
   i32.const 45
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.add
  i32.load8_u
 )
 (func $~lib/typedarray/Uint32Array#__set (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1760
   i32.const 2000
   i32.const 889
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
 )
 (func $~lib/typedarray/Uint32Array#__get (param $0 i32) (param $1 i32) (result i32)
  local.get $1
  local.get $0
  i32.load offset=8
  i32.const 2
  i32.shr_u
  i32.ge_u
  if
   i32.const 1760
   i32.const 2000
   i32.const 878
   i32.const 64
   call $~lib/builtins/abort
   unreachable
  end
  local.get $0
  i32.load offset=4
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  i32.load
 )
 (func $assembly/index/rotr (param $0 i32) (param $1 i32) (result i32)
  local.get $0
  i32.const 32
  local.get $1
  i32.sub
  i32.shl
  local.get $0
  local.get $1
  i32.shr_u
  i32.or
 )
 (func $~lib/staticarray/StaticArray<u32>#__uset (param $0 i32) (param $1 i32) (param $2 i32)
  local.get $0
  local.get $1
  i32.const 2
  i32.shl
  i32.add
  local.get $2
  i32.store
 )
 (func $assembly/index/sha256 (param $0 i32) (result i32)
  (local $1 i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i64)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
  local.tee $2
  i64.extend_i32_s
  i64.const 3
  i64.shl
  local.set $20
  local.get $2
  i32.const 1
  i32.add
  local.set $3
  loop $while-continue|0
   local.get $3
   i32.const 8
   i32.add
   i32.const 63
   i32.and
   if
    local.get $3
    i32.const 1
    i32.add
    local.set $3
    br $while-continue|0
   end
  end
  i32.const 12
  i32.const 6
  call $~lib/rt/stub/__new
  local.get $3
  i32.const 8
  i32.add
  local.tee $3
  i32.const 0
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $22
  loop $for-loop|1
   local.get $1
   local.get $2
   i32.lt_s
   if
    local.get $22
    local.get $1
    local.get $0
    local.get $1
    call $~lib/string/String#charCodeAt
    i32.const 255
    i32.and
    call $~lib/typedarray/Uint8Array#__set
    local.get $1
    i32.const 1
    i32.add
    local.set $1
    br $for-loop|1
   end
  end
  local.get $22
  local.get $2
  i32.const 128
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 8
  i32.sub
  i32.const 0
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 7
  i32.sub
  i32.const 0
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 6
  i32.sub
  i32.const 0
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 5
  i32.sub
  local.get $20
  i64.const 32
  i64.shr_u
  i32.wrap_i64
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 4
  i32.sub
  local.get $20
  i64.const 24
  i64.shr_u
  i32.wrap_i64
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 3
  i32.sub
  local.get $20
  i64.const 16
  i64.shr_u
  i32.wrap_i64
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 2
  i32.sub
  local.get $20
  i64.const 8
  i64.shr_u
  i32.wrap_i64
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  local.get $22
  local.get $3
  i32.const 1
  i32.sub
  local.get $20
  i32.wrap_i64
  i32.const 255
  i32.and
  call $~lib/typedarray/Uint8Array#__set
  i32.const 1536
  i32.const 0
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $15
  i32.const 1536
  i32.const 1
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $14
  i32.const 1536
  i32.const 2
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $13
  i32.const 1536
  i32.const 3
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $12
  i32.const 1536
  i32.const 4
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $11
  i32.const 1536
  i32.const 5
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $10
  i32.const 1536
  i32.const 6
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $9
  i32.const 1536
  i32.const 7
  call $~lib/staticarray/StaticArray<u32>#__get
  local.set $8
  local.get $3
  i32.const 64
  i32.div_s
  local.set $17
  i32.const 12
  i32.const 7
  call $~lib/rt/stub/__new
  i32.const 64
  i32.const 2
  call $~lib/arraybuffer/ArrayBufferView#constructor
  local.set $21
  loop $for-loop|2
   local.get $17
   local.get $18
   i32.gt_s
   if
    local.get $18
    i32.const 6
    i32.shl
    local.set $1
    i32.const 0
    local.set $0
    loop $for-loop|3
     local.get $0
     i32.const 16
     i32.lt_s
     if
      local.get $21
      local.get $0
      local.get $22
      local.get $1
      local.get $0
      i32.const 2
      i32.shl
      i32.add
      local.tee $2
      call $~lib/typedarray/Uint8Array#__get
      i32.const 24
      i32.shl
      local.get $22
      local.get $2
      i32.const 1
      i32.add
      call $~lib/typedarray/Uint8Array#__get
      i32.const 16
      i32.shl
      i32.or
      local.get $22
      local.get $2
      i32.const 2
      i32.add
      call $~lib/typedarray/Uint8Array#__get
      i32.const 8
      i32.shl
      i32.or
      local.get $22
      local.get $2
      i32.const 3
      i32.add
      call $~lib/typedarray/Uint8Array#__get
      i32.or
      call $~lib/typedarray/Uint32Array#__set
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|3
     end
    end
    i32.const 16
    local.set $0
    loop $for-loop|4
     local.get $0
     i32.const 64
     i32.lt_s
     if
      local.get $21
      local.get $0
      i32.const 15
      i32.sub
      local.tee $1
      call $~lib/typedarray/Uint32Array#__get
      i32.const 7
      call $assembly/index/rotr
      local.get $21
      local.get $1
      call $~lib/typedarray/Uint32Array#__get
      i32.const 18
      call $assembly/index/rotr
      i32.xor
      local.get $21
      local.get $1
      call $~lib/typedarray/Uint32Array#__get
      i32.const 3
      i32.shr_u
      i32.xor
      local.set $1
      local.get $21
      local.get $0
      local.get $21
      local.get $0
      i32.const 2
      i32.sub
      local.tee $2
      call $~lib/typedarray/Uint32Array#__get
      i32.const 17
      call $assembly/index/rotr
      local.get $21
      local.get $2
      call $~lib/typedarray/Uint32Array#__get
      i32.const 19
      call $assembly/index/rotr
      i32.xor
      local.get $21
      local.get $2
      call $~lib/typedarray/Uint32Array#__get
      i32.const 10
      i32.shr_u
      i32.xor
      local.get $21
      local.get $0
      i32.const 16
      i32.sub
      call $~lib/typedarray/Uint32Array#__get
      local.get $1
      i32.add
      local.get $21
      local.get $0
      i32.const 7
      i32.sub
      call $~lib/typedarray/Uint32Array#__get
      i32.add
      i32.add
      call $~lib/typedarray/Uint32Array#__set
      local.get $0
      i32.const 1
      i32.add
      local.set $0
      br $for-loop|4
     end
    end
    local.get $15
    local.set $7
    local.get $14
    local.set $0
    local.get $13
    local.set $3
    local.get $12
    local.set $5
    local.get $11
    local.set $6
    local.get $10
    local.set $1
    local.get $9
    local.set $2
    local.get $8
    local.set $4
    i32.const 0
    local.set $19
    loop $for-loop|5
     local.get $19
     i32.const 64
     i32.lt_s
     if
      local.get $6
      i32.const 6
      call $assembly/index/rotr
      local.get $6
      i32.const 11
      call $assembly/index/rotr
      i32.xor
      local.get $6
      i32.const 25
      call $assembly/index/rotr
      i32.xor
      local.set $16
      i32.const 1248
      local.get $19
      call $~lib/staticarray/StaticArray<u32>#__get
      local.get $4
      local.get $16
      i32.add
      local.get $1
      local.get $6
      i32.and
      local.get $6
      i32.const -1
      i32.xor
      local.get $2
      i32.and
      i32.xor
      i32.add
      i32.add
      local.get $21
      local.get $19
      call $~lib/typedarray/Uint32Array#__get
      i32.add
      local.set $23
      local.get $7
      i32.const 2
      call $assembly/index/rotr
      local.get $7
      i32.const 13
      call $assembly/index/rotr
      i32.xor
      local.get $7
      i32.const 22
      call $assembly/index/rotr
      i32.xor
      local.get $0
      local.get $3
      i32.and
      local.get $0
      local.get $7
      i32.and
      local.get $3
      local.get $7
      i32.and
      i32.xor
      i32.xor
      i32.add
      local.get $2
      local.set $4
      local.get $1
      local.set $2
      local.get $6
      local.set $1
      local.get $5
      local.get $23
      i32.add
      local.set $6
      local.get $3
      local.set $5
      local.get $0
      local.set $3
      local.get $7
      local.set $0
      local.get $23
      i32.add
      local.set $7
      local.get $19
      i32.const 1
      i32.add
      local.set $19
      br $for-loop|5
     end
    end
    local.get $7
    local.get $15
    i32.add
    local.set $15
    local.get $0
    local.get $14
    i32.add
    local.set $14
    local.get $3
    local.get $13
    i32.add
    local.set $13
    local.get $5
    local.get $12
    i32.add
    local.set $12
    local.get $6
    local.get $11
    i32.add
    local.set $11
    local.get $1
    local.get $10
    i32.add
    local.set $10
    local.get $2
    local.get $9
    i32.add
    local.set $9
    local.get $4
    local.get $8
    i32.add
    local.set $8
    local.get $18
    i32.const 1
    i32.add
    local.set $18
    br $for-loop|2
   end
  end
  i32.const 1600
  local.set $1
  i32.const 32
  i32.const 5
  call $~lib/rt/stub/__new
  local.tee $4
  i32.const 0
  local.get $15
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 1
  local.get $14
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 2
  local.get $13
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 3
  local.get $12
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 4
  local.get $11
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 5
  local.get $10
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 6
  local.get $9
  call $~lib/staticarray/StaticArray<u32>#__uset
  local.get $4
  i32.const 7
  local.get $8
  call $~lib/staticarray/StaticArray<u32>#__uset
  i32.const 0
  local.set $0
  loop $for-loop|6
   local.get $0
   i32.const 8
   i32.lt_s
   if
    local.get $4
    local.get $0
    call $~lib/staticarray/StaticArray<u32>#__get
    local.set $5
    i32.const 7
    local.set $3
    loop $for-loop|7
     local.get $3
     i32.const 0
     i32.ge_s
     if
      local.get $1
      local.get $5
      local.get $3
      i32.const 2
      i32.shl
      i32.shr_u
      i32.const 15
      i32.and
      local.tee $6
      i32.const 2060
      i32.load
      i32.const 1
      i32.shr_u
      i32.ge_u
      if
       i32.const 1600
       local.set $1
      else
       i32.const 2
       i32.const 2
       call $~lib/rt/stub/__new
       local.tee $1
       local.get $6
       i32.const 1
       i32.shl
       i32.const 2064
       i32.add
       i32.load16_u
       i32.store16
      end
      local.get $1
      call $~lib/string/String.__concat
      local.set $1
      local.get $3
      i32.const 1
      i32.sub
      local.set $3
      br $for-loop|7
     end
    end
    local.get $0
    i32.const 1
    i32.add
    local.set $0
    br $for-loop|6
   end
  end
  local.get $1
 )
 (func $assembly/index/signRequest (param $0 i32) (param $1 i32)
  local.get $0
  local.get $1
  call $assembly/index/readString
  i32.const 1120
  call $assembly/index/decodeSalt
  call $~lib/string/String.__concat
  call $assembly/index/sha256
  global.set $assembly/index/signResult
 )
 (func $assembly/index/getSignResultPtr (result i32)
  global.get $assembly/index/signResult
 )
 (func $assembly/index/getSignResultLen (result i32)
  global.get $assembly/index/signResult
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
 )
 (func $~lib/string/String#substring (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  local.get $1
  i32.const 0
  local.get $1
  i32.const 0
  i32.gt_s
  select
  local.tee $3
  local.get $0
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
  local.tee $1
  local.get $1
  local.get $3
  i32.gt_s
  select
  local.tee $3
  local.get $2
  i32.const 0
  local.get $2
  i32.const 0
  i32.gt_s
  select
  local.tee $2
  local.get $1
  local.get $1
  local.get $2
  i32.gt_s
  select
  local.tee $2
  local.get $2
  local.get $3
  i32.gt_s
  select
  i32.const 1
  i32.shl
  local.set $4
  local.get $3
  local.get $2
  local.get $2
  local.get $3
  i32.lt_s
  select
  i32.const 1
  i32.shl
  local.tee $2
  local.get $4
  i32.sub
  local.tee $3
  i32.eqz
  if
   i32.const 1600
   return
  end
  local.get $4
  i32.eqz
  local.get $2
  local.get $1
  i32.const 1
  i32.shl
  i32.eq
  i32.and
  if
   local.get $0
   return
  end
  local.get $3
  i32.const 2
  call $~lib/rt/stub/__new
  local.tee $1
  local.get $0
  local.get $4
  i32.add
  local.get $3
  memory.copy
  local.get $1
 )
 (func $assembly/index/generateFingerprint (param $0 i32) (param $1 i32) (result i32)
  (local $2 i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  local.get $0
  local.get $1
  call $assembly/index/readString
  local.set $8
  block $__inlined_func$~lib/string/String#indexOf$30
   i32.const 2124
   i32.load
   i32.const 1
   i32.shr_u
   local.tee $1
   i32.eqz
   br_if $__inlined_func$~lib/string/String#indexOf$30
   i32.const -1
   local.set $2
   local.get $8
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const 1
   i32.shr_u
   local.tee $3
   i32.eqz
   br_if $__inlined_func$~lib/string/String#indexOf$30
   local.get $3
   i32.const 0
   local.get $3
   i32.const 0
   i32.le_s
   select
   local.set $0
   local.get $3
   local.get $1
   i32.sub
   local.set $7
   loop $for-loop|0
    local.get $0
    local.get $7
    i32.le_s
    if
     block $__inlined_func$~lib/util/string/compareImpl$13 (result i32)
      i32.const 2128
      local.set $6
      local.get $8
      local.get $0
      local.tee $2
      i32.const 1
      i32.shl
      i32.add
      local.tee $4
      i32.const 7
      i32.and
      i32.eqz
      local.get $1
      local.tee $0
      i32.const 4
      i32.ge_u
      i32.and
      if
       loop $do-loop|0
        local.get $4
        i64.load
        local.get $6
        i64.load
        i64.eq
        if
         local.get $4
         i32.const 8
         i32.add
         local.set $4
         local.get $6
         i32.const 8
         i32.add
         local.set $6
         local.get $0
         i32.const 4
         i32.sub
         local.tee $0
         i32.const 4
         i32.ge_u
         br_if $do-loop|0
        end
       end
      end
      loop $while-continue|1
       local.get $0
       local.tee $3
       i32.const 1
       i32.sub
       local.set $0
       local.get $3
       if
        local.get $4
        i32.load16_u
        local.tee $9
        local.get $6
        i32.load16_u
        local.tee $3
        i32.ne
        if
         local.get $9
         local.get $3
         i32.sub
         br $__inlined_func$~lib/util/string/compareImpl$13
        end
        local.get $4
        i32.const 2
        i32.add
        local.set $4
        local.get $6
        i32.const 2
        i32.add
        local.set $6
        br $while-continue|1
       end
      end
      i32.const 0
     end
     i32.eqz
     br_if $__inlined_func$~lib/string/String#indexOf$30
     local.get $2
     i32.const 1
     i32.add
     local.set $0
     br $for-loop|0
    end
   end
   i32.const -1
   local.set $2
  end
  local.get $2
  i32.const 0
  i32.lt_s
  if
   i32.const 1600
   global.set $assembly/index/fpResult
   i32.const 0
   return
  end
  local.get $8
  i32.const 0
  local.get $2
  call $~lib/string/String#substring
  local.set $0
  i32.const 1
  global.set $~argumentsLength
  local.get $8
  local.get $2
  i32.const 1
  i32.add
  i32.const 2147483647
  call $~lib/string/String#substring
  local.set $1
  block $__inlined_func$assembly/index/isValidVisitorId$32
   local.get $0
   i32.const 20
   i32.sub
   i32.load offset=16
   i32.const 1
   i32.shr_u
   i32.const 10
   i32.lt_u
   if (result i32)
    i32.const 1
   else
    local.get $0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.const 64
    i32.gt_u
   end
   br_if $__inlined_func$assembly/index/isValidVisitorId$32
   i32.const 0
   local.set $2
   loop $for-loop|00
    local.get $2
    local.get $0
    i32.const 20
    i32.sub
    i32.load offset=16
    i32.const 1
    i32.shr_u
    i32.lt_s
    if
     local.get $0
     local.get $2
     call $~lib/string/String#charCodeAt
     local.tee $3
     i32.const 48
     i32.ge_s
     local.tee $4
     if (result i32)
      local.get $3
      i32.const 57
      i32.le_s
     else
      local.get $4
     end
     local.get $3
     i32.const 97
     i32.ge_s
     local.tee $4
     if (result i32)
      local.get $3
      i32.const 122
      i32.le_s
     else
      local.get $4
     end
     i32.or
     local.get $3
     i32.const 90
     i32.le_s
     local.get $3
     i32.const 65
     i32.ge_s
     local.tee $3
     local.get $3
     select
     i32.or
     i32.eqz
     br_if $__inlined_func$assembly/index/isValidVisitorId$32
     local.get $2
     i32.const 1
     i32.add
     local.set $2
     br $for-loop|00
    end
   end
   i32.const 1
   local.set $5
  end
  local.get $5
  i32.eqz
  if
   i32.const 1600
   global.set $assembly/index/fpResult
   i32.const 0
   return
  end
  i32.const 1184
  call $assembly/index/decodeSalt
  local.set $2
  local.get $0
  i32.const 2128
  call $~lib/string/String.__concat
  local.get $1
  call $~lib/string/String.__concat
  i32.const 2128
  call $~lib/string/String.__concat
  local.get $2
  call $~lib/string/String.__concat
  call $assembly/index/sha256
  global.set $assembly/index/fpResult
  i32.const 1
 )
 (func $assembly/index/getFpResultPtr (result i32)
  global.get $assembly/index/fpResult
 )
 (func $assembly/index/getFpResultLen (result i32)
  global.get $assembly/index/fpResult
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
 )
 (func $assembly/index/computeIntegrityHash
  i32.const 1056
  i32.const 1120
  call $assembly/index/decodeSalt
  call $~lib/string/String.__concat
  call $assembly/index/sha256
  global.set $assembly/index/integrityResult
 )
 (func $assembly/index/getIntegrityResultPtr (result i32)
  global.get $assembly/index/integrityResult
 )
 (func $assembly/index/getIntegrityResultLen (result i32)
  global.get $assembly/index/integrityResult
  i32.const 20
  i32.sub
  i32.load offset=16
  i32.const 1
  i32.shr_u
 )
 (func $~start
  i32.const 2140
  global.set $~lib/rt/stub/offset
 )
)
