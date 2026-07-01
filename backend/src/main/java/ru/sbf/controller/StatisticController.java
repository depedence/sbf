package ru.sbf.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.sbf.dto.response.StatisticResponse;
import ru.sbf.service.StatisticService;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/statistic")
@RequiredArgsConstructor
public class StatisticController {

    private final StatisticService statisticService;

    @GetMapping
    public StatisticResponse getStatistic(@RequestParam LocalDateTime from, @RequestParam LocalDateTime to) {
        return statisticService.getStatistic(from, to);
    }
}