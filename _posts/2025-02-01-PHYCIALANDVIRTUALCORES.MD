---
title: Understanding Physical vs Virtual Cores
date: 2025-02-02 01:01:01 +/-TTTT
categories: [cpu cores, linux, windows, mac]
tags: [physical cpu cores, virtual cpu cores]     # TAG names should always be lowercase
---

<script data-goatcounter="https://arulwebsite.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>


<script>
    // Append to the <body>; can use a CSS selector to append somewhere else.
    window.goatcounter.visit_count({append: 'body'})
</script>


This document provides background on how to understands Physical and Virtual CPU cores on Linux, Windows and MAC

**Virtualization:** If you're on a virtual machine (VM), the number of physical cores you see might be the number of cores allocated to your VM, not the total number of physical cores on the host machine.

**Hyper-threading:** Hyper-threading allows a single physical core to handle multiple threads concurrently, making it appear as multiple logical cores to the operating system.
 
## Linux VM

### Via  lscpu:

The lscpu command provides detailed information about the CPU architecture, including the number of cores.


```
lscpu
```

![ragappimage](/static/linux.png)

Sample Output:
```
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                8
On-line CPU(s) list:   0-7
Thread(s) per core:    2
Core(s) per socket:    4
Socket(s):             1
NUMA node(s):          1
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 158
Model name:            Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz
Stepping:              10
CPU MHz:               2900.000
BogoMIPS:              5800.00
Hypervisor vendor:     VMware
Virtualization type:   full
L1d cache:             32K
L1i cache:             32K
L2 cache:              256K
L3 cache:              16384K
Flags:                 fpu vme de pse tsc msr pae mce cx8 apic sep mtrr pge mca avx avx2
```

CPU(s): Shows the total number of logical processors (virtual cores). In this case, 8.
Thread(s) per core: Shows the number of threads per physical core. Here, 2 (meaning hyper-threading is enabled).  
Core(s) per socket: Shows the number of physical cores per socket. Here, 4.
Socket(s): Shows the number of CPU sockets.

To calculate:

Physical Cores: Core(s) per socket x Socket(s) = 4 x 1 = 4
Virtual Cores: CPU(s) = 8 (or Thread(s) per core x Core(s) per socket x Socket(s) = 2 x 4 x 1 = 8)

### Via /proc/cpuinfo:

The /proc/cpuinfo file contains detailed information about each logical processor.

```
cat /proc/cpuinfo
```
Sample Output (truncated):

```
processor       : 0
vendor_id       : GenuineIntel
cpu family      : 6
model           : 158
model name      : Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz
...
core id         : 0
physical id     : 0
siblings        : 2
...

processor       : 1
vendor_id       : GenuineIntel
cpu family      : 6
model           : 158
model name      : Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz
...
core id         : 0
physical id     : 0
siblings        : 2
...
```

Each "processor" entry represents a logical core. Count the number of "processor" entries to get the total number of logical cores.
The "core id" shows which physical core the logical processor belongs to. Count the unique "core id" values to get the number of physical cores.
The "siblings" value indicates the number of threads per core.

### Via nproc:

The nproc command simply prints the number of available processors (logical cores).

```
nproc
```
Sample Output:
```
8
```

## Windows VM

### Via wmic

![ragappimage](/static/windows.png)

```
PS C:\Users\Administrator> wmic
wmic:root\cli>CPU Get NumberOfCores,NumberOfLogicalProcessors /Format:List

NumberOfCores=2
NumberOfLogicalProcessors=2

NumberOfCores=2
NumberOfLogicalProcessors=2

wmic:root\cli>
```

### Understanding the Output:
```
NumberOfCores=2
NumberOfLogicalProcessors=2

NumberOfCores=2
NumberOfLogicalProcessors=2
```
This output shows two sets of results.  This is important. It indicates that your system has two separate CPUs (or CPU sockets). It's not showing hyper-threading.

**NumberOfCores:** This directly tells you the number of physical cores in each CPU. In this case, each CPU has 2 physical cores.
NumberOfLogicalProcessors: This tells you the number of logical processors (or virtual cores) in each CPU. Here, it's also 2.
Calculating Physical and Virtual Cores:

Since NumberOfCores and NumberOfLogicalProcessors are the same for each CPU, this means:

Physical Cores (Total): 2 (cores per CPU) * 2 (CPUs) = 4 physical cores

Virtual Cores (Total): 2 (logical processors per CPU) * 2 (CPUs) = 4 virtual cores

### Hyper-threading:

**Hyper-threading:** Because the number of cores and logical processors is the same for each CPU, hyper-threading is not enabled. If hyper-threading were enabled, you would see NumberOfLogicalProcessors be double the NumberOfCores.

For example, if each CPU had 2 cores and hyper-threading was on, you'd see NumberOfCores=2 and NumberOfLogicalProcessors=4 for each CPU.

**Multiple CPUs/Sockets:** This output clearly shows that you have two physical CPUs (or sockets) in this system. This is why you see two sets of results.
VMware (Likely): If this is a virtual machine (VM), the number of physical cores you see (4 in this case) represents the number of physical cores allocated to your VM. The host machine that the VM runs on likely has more physical cores. The VM only sees what it's given.
Other Ways to Check (GUI):

### Via Windows GUI:

**Task Manager:** Open Task Manager (Ctrl+Shift+Esc). Go to the "Performance" tab and select "CPU." It will show you the number of cores and logical processors. However, it might not explicitly show the number of physical CPUs/sockets.
System Information: Search for "System Information" in the Windows search bar. In the System Information window, look for "Processor." This will give you a description of the processor(s), which may include information about the number of cores. However, like Task Manager, it might not explicitly show separate CPU sockets.
The wmic command you used is the most direct and reliable way to get this information programmatically in Windows.  The GUI methods are useful for a quick visual check.


## MAC

```
sysctl -a | grep -E "physical_cpu|logical_cpu|core_count"
```
Sample output:
```
$ sysctl -a | grep -E "physical_cpu|logical_cpu|core_count"
machdep.cpu.core_count: 10
```

<script src="https://giscus.app/client.js"
        data-repo="cfkubo/cfkubo.github.io"
        data-repo-id="R_kgDOONa2fg"
        data-category="General"
        data-category-id="DIC_kwDOONa2fs4CofaO"
        data-mapping="pathname"
        data-strict="0"
        data-reactions-enabled="1"
        data-emit-metadata="0"
        data-input-position="bottom"
        data-theme="dark_high_contrast"
        data-lang="en"
        crossorigin="anonymous"
        async>
</script>
